// Background remover for the new Tamil gold line-art motifs.
// The generated JPEGs have a baked-in checkerboard (neutral gray/white) background.
// The artwork is colour-saturated gold, so we key out by CHROMA (max-min channel):
//   neutral & light  -> transparent (background)
//   saturated (gold) -> kept
// A feather band gives smooth anti-aliased edges.
const { Jimp } = require("jimp");
const path = require("path");
const fs = require("fs");

const imagesDir = path.join(__dirname, "images");

const jobs = [
  ["__src_poikkal.jpg", "poikkal-kuthirai.png"],
  ["__src_thombai.jpg", "thombai.png"],
  ["__src_kuthuvilakku.jpg", "kuthuvilakku.png"],
  ["__src_kalasam.jpg", "kalasam.png"],
  ["__src_sangu-mani.jpg", "sangu-mani.png"],
  ["__src_mayil.jpg", "mayil.png"],
  ["__src_mango-lotus-border.jpg", "mango-lotus-border.png"],
];

const LOW = 22;   // chroma <= LOW  -> fully transparent
const HIGH = 50;  // chroma >= HIGH -> fully opaque
const DARK = 110; // neutral pixels darker than this are kept (real dark detail)

async function run() {
  for (const [src, dst] of jobs) {
    const srcPath = path.join(imagesDir, src);
    if (!fs.existsSync(srcPath)) { console.log("MISSING", src); continue; }
    const img = await Jimp.read(srcPath);
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      const chroma = mx - mn;
      let alpha;
      if (mx <= DARK) alpha = 255;
      else if (chroma <= LOW) alpha = 0;
      else if (chroma >= HIGH) alpha = 255;
      else alpha = Math.round(((chroma - LOW) / (HIGH - LOW)) * 255);
      this.bitmap.data[idx + 3] = alpha;
    });
    await img.write(path.join(imagesDir, dst));
    console.log("wrote", dst, `(${img.bitmap.width}x${img.bitmap.height})`);
  }
}

run().then(() => console.log("done")).catch((e) => { console.error(e); process.exit(1); });
