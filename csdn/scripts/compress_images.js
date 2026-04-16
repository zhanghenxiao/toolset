const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const excludedDirs = ['node_modules', 'dist', '.git', '.gemini'];

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    const stat = fs.statSync(name);
    if (stat.isDirectory()) {
      if (!excludedDirs.includes(files[i])) {
        getFiles(name, files_);
      }
    } else {
      if (/\.(png|jpg|jpeg|webp)$/i.test(name)) {
        files_.push({
          path: name,
          size: stat.size
        });
      }
    }
  }
  return files_;
}

function writeAsync(image, outputPath) {
    return new Promise((resolve, reject) => {
        image.write(outputPath, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function compressImage(imgPath, oldSize) {
  try {
    const image = await Jimp.read(imgPath);
    const mime = image._originalMime;
    const ext = path.extname(imgPath).toLowerCase();
    const tempPath = imgPath + '.tmp';
    
    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      image.quality(75);
    } else if (mime === 'image/png') {
      // Magic: reduce to 256 colors for huge savings in PNGs
      image.quantize(256);
    } else if (mime === 'image/webp') {
      image.quality(75);
    }

    await writeAsync(image, tempPath);

    const newSize = fs.statSync(tempPath).size;
    
    if (newSize < oldSize) {
      fs.renameSync(tempPath, imgPath);
      console.log(`[OK] Compressed ${path.relative(rootDir, imgPath)} (${mime}): ${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (${Math.round((1 - newSize/oldSize)*100)}% saved)`);
      return { oldSize, newSize, success: true };
    } else {
      fs.unlinkSync(tempPath);
      return { oldSize, newSize: oldSize, success: false };
    }
  } catch (err) {
    console.error(`[ERR] Failed to process ${imgPath}: ${err.message}`);
    return { oldSize, newSize: oldSize, success: false };
  }
}

async function main() {
  console.log('--- csdn Image Optimizer (Jimp + Quantize) ---');
  const images = getFiles(rootDir);
  console.log(`Found ${images.length} candidate images.`);
  
  let totalOld = 0;
  let totalNew = 0;
  let count = 0;

  for (const img of images) {
    const res = await compressImage(img.path, img.size);
    totalOld += res.oldSize;
    totalNew += res.newSize;
    if (res.success) count++;
  }

  console.log('\n--- Summary ---');
  console.log(`Successfully optimized: ${count} images`);
  console.log(`Total footprint: ${(totalOld/1024).toFixed(1)}KB -> ${(totalNew/1024).toFixed(1)}KB`);
  if (totalOld > 0) {
      console.log(`Total storage saved: ${((totalOld - totalNew)/1024).toFixed(1)}KB (${( (1 - totalNew/totalOld)*100 ).toFixed(1)}%)`);
  }
  console.log('----------------');
}

main();
