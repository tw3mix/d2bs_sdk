#define USE_CONSOLE
#include <allegro.h>
#include <stdio.h>

#define FALSE 0
#define TRUE -1

typedef unsigned char UBYTE;


#pragma pack(1)
typedef struct
{
   long  version;        // 06 00 00 00
   long  unknown1;       // 01 00 00 00
   long  unknown2;       // 00 00 00 00
   UBYTE termination[4]; // EE EE EE EE or CD CD CD CD
   long  directions;     // xx 00 00 00
   long  frames_per_dir; // xx 00 00 00
} DC6_HEADER_S;

typedef struct
{
   long unknown1;
   long width;
   long height;
   long offset_x;
   long offset_y; // from bottom border, not up
   long unknown2;
   long next_block;
   long length;
} DC6_FRAME_HEADER_S;
#pragma pack()


// ==========================================================================
void * load_dc6_in_mem(char * dc6_name)
{
   FILE * in;
   void * ptr;
   long size;

   in = fopen(dc6_name, "rb");
   if (in == NULL)
   {
      fprintf(stderr, "can't open dc6 file \"%s\"\n", dc6_name);
      fflush(stderr);
      return NULL;
   }
   fseek(in, 0, SEEK_END);
   size = ftell(in);
   fseek(in, 0, SEEK_SET);
   ptr = (void *) malloc(size);
   if (ptr == NULL)
   {
      fprintf(stderr, "not enough mem (%li) for loading \"%s\" in mem",
         size, dc6_name);
      fflush(stderr);
      return NULL;
   }
   fread(ptr, size, 1, in);
   
   // ok
   fclose(in);
   return ptr;
}


// ==========================================================================
int is_font_dc6(void * ptr, int * w, int * h)
{
   DC6_HEADER_S       * head = (DC6_HEADER_S *) ptr;
   DC6_FRAME_HEADER_S * frm;
   int                f;
   long               * offset;

   if ((head->directions != 1) || (head->frames_per_dir != 256))
      return FALSE;

   offset = (long *) (head + 1);
   for (f=0; f<256; f++)
   {
      frm = (DC6_FRAME_HEADER_S *) (((char *) head) + offset[f]);
      if (f == 0)
      {
         * w = frm->width;
         * h = frm->height;
      }
      else
      {
         if ((frm->width != * w) || (frm->height != * h))
            return FALSE;
      }
      if (frm->offset_x || frm->offset_y)
         return FALSE;
   }
   return TRUE;
}


// ==========================================================================
void decompress_dc6_frame(void * src, BITMAP * dst, long size, int x0, int y0)
{
   UBYTE * ptr = (UBYTE *) src;
   long  i;
   int   i2, x=x0, y=y0, c, c2;
   
   for (i=0; i<size; i++)
   {
      c = * (ptr ++);

      if (c == 0x80)
      {
         x = x0;
         y--;
      }
      else if (c & 0x80)
         x += c & 0x7F;
      else
      {
         for (i2=0; i2<c; i2++)
         {
            c2 = * (ptr ++);
            i++;
            putpixel(dst, x, y, c2);
            x++;
         }
      }
   }
}


// ==========================================================================
BITMAP * make_pcx(void * ptr)
{
   DC6_HEADER_S       * head = (DC6_HEADER_S *) ptr;
   DC6_FRAME_HEADER_S * frm;
   int                f, x, y;
   long               * offset;
   BITMAP             * bmp;

   offset = (long *) (head + 1);
   for (f=0; f<256; f++)
   {
      frm = (DC6_FRAME_HEADER_S *) (((char *) head) + offset[f]);
      if (f == 0)
      {
         bmp = create_bitmap(frm->width * 16, frm->height * 16);
         if (bmp == NULL)
            return NULL;
         clear(bmp);
      }
      y = (frm->height * (f / 16)) + frm->height - 1;
      x = frm->width * (f % 16);
      decompress_dc6_frame(frm + 1, bmp, frm->length, x, y);
   }
   return bmp;
}


// ==========================================================================
int is_font_pcx(BITMAP * bmp, int * w, int * h)
{
   * w = bmp->w / 16;
   * h = bmp->h / 16;
   if ((bmp->w % 16) || (bmp->h % 16))
      return FALSE;
   return TRUE;
}


// ==========================================================================
void compress_dc6_frame(FILE * out, BITMAP * src, int x0, int y0, int w, int h)
{
   BITMAP * sub;
   int    done = FALSE, n, i, c, x = 0, y = h - 1;

   sub = create_sub_bitmap(src, x0, y0, w, h);
   if (sub == NULL)
      return;

   while (! done)
   {
      // End Of Line ?
      n = 0;
      while ((_getpixel(sub, x+n, y) == 0) && (x+n < w))
         n++;
      if (x+n >= w)
      {
         // EOL
         fputc(0x80, out);
         x = 0;
         y--;
         if (y < 0)
            done = TRUE;
      }
      else
      {
         if (n)
         {
            // JUMPS
            while (n >= 0x7F)
            {
               fputc(0xFF, out);
               n -= 0x7F;
               x += 0x7F;
            }
            if (n)
               fputc(0x80 | n, out);
         }

         // PIXELS
         x += n;
         n = 0;
         while (_getpixel(sub, x+n, y) && (x+n < w))
            n++;
         if (n)
         {
            while (n >= 0x7F)
            {
               fputc(0x7F, out);
               for (i=0; i< 0x7F; i++)
               {
                  c = _getpixel(sub, x+i, y);
                  fputc(c, out);
               }
               n -= 0x7F;
               x += 0x7F;
            }
            if (n)
            {
               fputc(n, out);
               for (i=0; i < n; i++)
               {
                  c = _getpixel(sub, x+i, y);
                  fputc(c, out);
               }
               x += n;
               n = 0;
            }
         }
      }
   }
   
   // termination bytes
   for (i=0; i<3; i++)
      fputc(0xEE, out);
   
   destroy_bitmap(sub);
}


// ==========================================================================
void make_dc6(char * name, BITMAP * bmp, int w, int h)
{
   DC6_HEADER_S       header;
   DC6_FRAME_HEADER_S frame;
   FILE               * out;
   long               frame_ptr_base, zero = 0L, start_data_ptr, end_data_ptr;
   long               cur_ptr;
   int                i, x, y;


   out = fopen(name, "wb");
   if (out == NULL)
      return;
      
   // make & write dc6 header
   header.version        = 0x00000006L;
   header.unknown1       = 0x00000001L;
   header.unknown2       = 0x00000000L;
   header.termination[0] = 0xEE;
   header.termination[1] = 0xEE;
   header.termination[2] = 0xEE;
   header.termination[3] = 0xEE;
   header.directions     = 1;
   header.frames_per_dir = 256;
   fwrite(& header, sizeof(DC6_HEADER_S), 1, out);

   // write fake frame pointers
   fflush(out);
   frame_ptr_base = ftell(out);
   for (i=0; i < 256; i++)
      fwrite(& zero, 4, 1, out);
   fflush(out);

   // write frames
   for (i=0; i<256; i++)
   {
      y = h * (i / 16);
      x = w * (i % 16);
      
      cur_ptr = ftell(out);
      
      // update frame pointer
      fflush(out);
      fseek(out, frame_ptr_base + 4 * i, SEEK_SET);
      fwrite(& cur_ptr, 4, 1, out);
      fflush(out);
      fseek(out, cur_ptr, SEEK_SET);

      // temp frame header
      frame.unknown1   = 0L;
      frame.width      = w;
      frame.height     = h;
      frame.offset_x   = 0L;
      frame.offset_y   = 0L;
      frame.unknown2   = 0L;
      frame.next_block = 0L;
      frame.length     = 0L;
      fwrite(& frame, sizeof(DC6_FRAME_HEADER_S), 1, out);

      // make & write the frame
      start_data_ptr = ftell(out);
      compress_dc6_frame(out, bmp, x, y, w, h);
      end_data_ptr = ftell(out);

      // update the frame header
      frame.next_block = end_data_ptr;
      frame.length     = end_data_ptr - start_data_ptr - 3;
      fflush(out);
      fseek(out, cur_ptr, SEEK_SET);
      fwrite(& frame, sizeof(DC6_FRAME_HEADER_S), 1, out);
      fflush(out);
      fseek(out, end_data_ptr, SEEK_SET);
   }

   // end
   fclose(out);
}


// ==========================================================================
int load_dat_palette(char * name, PALETTE pal)
{
   FILE * in;
   int  i, r, g, b;

   in = fopen(name, "rb");
   if (in == NULL)
   {
      fprintf(stderr, "can't open palette file \"%s\"\n", name);
      return 1;
   }

   // read d2 dat palette format (BGR instead of RGB)
   for (i=0; i<256; i++)
   {
      b = fgetc(in);
      g = fgetc(in);
      r = fgetc(in);
      pal[i].r = r >> 2;
      pal[i].g = g >> 2;
      pal[i].b = b >> 2;
   }
   fclose(in);

   // ok
   return 0;
}


// ==========================================================================
int main(int argc, char ** argv)
{
   BITMAP  * bmp;
   void    * dc6;
   PALETTE dummy_pal;
   int     w, h, len;
   char    outname[512], d2datname[512];


   allegro_init();
   set_color_depth(8);

   
   if (argc != 2)
   {
      printf("\nDC6FONT, freeware"
             "=========\n"
             "\n"
             "syntaxe : dc6font <filename>\n"
             "   <filename> must be either a .pcx or a .dc6\n"
      );
      return 0;
   }

   strlwr(argv[1]);
   strcpy(outname, argv[1]);
   len = strlen(outname);

   if (strstr(argv[1], ".dc6") != NULL)
   {
      // dc6 to pcx
      strcpy(d2datname, argv[0]);
      strcpy( & d2datname[strlen(d2datname) - strlen("dc6font.exe")], "act1.dat");
      if (load_dat_palette(d2datname, dummy_pal))
         return 1;
      strcpy( & outname[len - 4], ".pcx");
      dc6 = load_dc6_in_mem(argv[1]);
      if (dc6 != NULL)
      {
         if (is_font_dc6(dc6, & w, & h))
         {
            printf("making_pcx...");
            bmp = make_pcx(dc6);
            if (bmp != NULL)
            {
               save_pcx(outname, bmp, dummy_pal);
               destroy_bitmap(bmp);
               printf("ok : each character is %i * %i pixels\n", w, h);
            }
            else
               printf("ERROR\n");
         }
         else
            printf("%s is not a good .dc6 Font\n", argv[1]);
         free(dc6);
      }
   }
   else
   {
      // pcx to dc6
      strcpy( & outname[len - 4], ".dc6");
      bmp = load_pcx(argv[1], dummy_pal);
      if (bmp == NULL)
      {
         printf("can't open %s\n", argv[1]);
         return 1;
      }
      else
      {
         if (is_font_pcx(bmp, & w, & h))
         {
            printf("Good .pcx font, each character is %i * %i pixels\n", w, h);
            printf("making_dc6...\n");
            make_dc6(outname, bmp, w, h);
         }
         else
            printf("%s is not a good .pcx Font\n", argv[1]);
         destroy_bitmap(bmp);
      }
   }

   return 0;
}
END_OF_MAIN();
