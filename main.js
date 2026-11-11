const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const file = () => path.join(app.getPath('userData'), 'projects.json');
const s = v => (typeof v === 'string' ? v : '');
function safeUrl(a) {
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(a) ? a : 'https://' + a);
    return /^https?:$/.test(u.protocol) ? u.href : null;
  } catch { return null; }
}

ipcMain.on('load', e => {
  try { e.returnValue = JSON.parse(fs.readFileSync(file(), 'utf8')); }
  catch (err) {
    // bozuk dosyayı ezmeden kenara al: liste kaybolmasın
    if (err.code !== 'ENOENT') try { fs.renameSync(file(), file() + '.bozuk'); } catch {}
    e.returnValue = null;
  }
});
ipcMain.on('save', (_e, list) => {
  if (!Array.isArray(list)) return;
  fs.writeFileSync(file() + '.tmp', JSON.stringify(list, null, 2)); // önce geçici dosya: yarım yazılmış liste kalmasın
  fs.renameSync(file() + '.tmp', file());
});
ipcMain.handle('open', async (_e, p) => {
  const adres = s(p && p.adres), komut = s(p && p.komut);
  if (p.tur === 'web') {
    const u = safeUrl(adres);
    if (!u) return 'Adres geçerli bir web adresi değil. Düzenle, http veya https ile yaz.';
    await shell.openExternal(u);
    return '';
  }
  if (!adres || !fs.existsSync(adres)) return 'Yol bulunamadı: ' + adres;
  if (p.tur === 'local-app' && komut) {
    const cwd = fs.statSync(adres).isDirectory() ? adres : path.dirname(adres);
    spawn(komut, { cwd, shell: true, detached: true, stdio: 'ignore' }).on('error', () => {}).unref();
    return '';
  }
  return shell.openPath(adres); // başarıda '', değilse hata metni
});
ipcMain.handle('check', async (_e, p) => {
  const adres = s(p && p.adres);
  if (p.tur !== 'web') return !!adres && fs.existsSync(adres);
  const u = safeUrl(adres);
  if (!u) return false;
  try { return (await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(6000) })).status < 500; }
  catch { return false; }
});

app.whenReady().then(() => {
  const w = new BrowserWindow({
    width: 1320, height: 880, backgroundColor: '#08121d', autoHideMenuBar: true, title: 'REDMOND Proje Limanı',
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  w.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  w.webContents.on('will-navigate', e => e.preventDefault());
  w.loadFile('index.html');
});
app.on('window-all-closed', () => app.quit());
