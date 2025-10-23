const fs = require('fs');
const path = require('path');

/**
 * Copie un fichier si présent.
 */
function copyIfExists(source, targetDir, dryRun) {
    if (fs.existsSync(source)) {
        const fileName = path.basename(source);
        const target = path.join(targetDir, fileName);

        if (dryRun) {
            console.log(`📄 [DRY RUN] Fichier copié : ${fileName}`);
        } else {
            fs.copyFileSync(source, target);
            console.log(`📄 Fichier copié : ${fileName}`);
        }
    }
}

/**
 * Nettoie un package.json et copie les fichiers nécessaires dans le dossier dist.
 */
function cleanPackage(source, targetDir, keysToRemove = ['scripts', 'devDependencies'], dryRun = false) {
    const raw = fs.readFileSync(source, 'utf-8');
    const pkg = JSON.parse(raw);

    console.log(`📦 Lecture de ${source}`);
    console.log(`🧹 Suppression des clés : ${keysToRemove.join(', ')}\n`);

    keysToRemove.forEach(key => {
        if (pkg[key]) {
            delete pkg[key];
            console.log(`🗑️  Clé supprimée : ${key}`);
        }
    });

    if (dryRun) {
        console.log(`\n🔍 [DRY RUN] package.json nettoyé :\n`);
        console.log(JSON.stringify(pkg, null, 2));
        console.log(`\n💡 Aucun fichier écrit (dry run activé).\n`);
        return;
    }

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const target = path.join(targetDir, 'package.json');
    fs.writeFileSync(target, JSON.stringify(pkg, null, 2), 'utf-8');
    console.log(`✅ package.json copié et nettoyé dans ${targetDir}\n`);
}

// -------------------------------------------------------------
// Configuration simple
// -------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const ROOT = __dirname;
const SOURCE = path.join(ROOT, 'package.json');
const TARGET = path.join(ROOT, 'dist');

const KEYS_TO_REMOVE = [
    'scripts',
    'devDependencies',
];

const FILES_TO_COPY = ['README.md', 'LICENSE'];

// -------------------------------------------------------------
// Exécution directe
// -------------------------------------------------------------

cleanPackage(SOURCE, TARGET, KEYS_TO_REMOVE, dryRun);

FILES_TO_COPY.forEach(file =>
    copyIfExists(path.join(ROOT, file), TARGET, dryRun)
);
