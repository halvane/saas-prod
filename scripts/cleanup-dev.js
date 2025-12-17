#!/usr/bin/env node

const os = require('os');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function cleanup() {
  try {
    if (os.platform() === 'win32') {
      // Windows: PowerShell commands
      console.log('🧹 Cleaning up Node processes (Windows)...');
      await execAsync(
        `powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue; Get-Process next -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue; Start-Sleep -Milliseconds 500"`,
        { shell: true }
      );
    } else {
      // Unix/Mac: kill commands
      console.log('🧹 Cleaning up Node processes (Unix/Mac)...');
      try {
        await execAsync('pkill -f "node|next" || true', { shell: true });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch {
        // Process might not exist, continue
      }
    }

    // Remove .next lock file (cross-platform)
    const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock');
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
      console.log('🗑️  Removed .next/dev/lock');
    }

    // Remove .next cache (optional, commented out by default)
    // const nextPath = path.join(process.cwd(), '.next');
    // if (fs.existsSync(nextPath)) {
    //   fs.rmSync(nextPath, { recursive: true, force: true });
    //   console.log('🗑️  Removed .next cache');
    // }

    console.log('✅ Cleanup complete!\n');
  } catch (error) {
    console.warn('⚠️  Cleanup warning:', error.message);
    // Don't fail the dev server if cleanup fails
  }
}

cleanup();
