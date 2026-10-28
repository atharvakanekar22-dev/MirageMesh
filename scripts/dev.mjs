import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = [
  spawn(npmCommand, ['run', 'dev:client', '--', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }),
  spawn(npmCommand, ['run', 'dev'], {
    cwd: path.join(root, 'server'),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }),
]

let shuttingDown = false

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return
  shuttingDown = true
  children.forEach((child) => child.kill())
  process.exit(exitCode)
}

children.forEach((child) => {
  child.on('exit', (code, signal) => {
    if (!shuttingDown && (code ?? 0) !== 0) {
      console.error(`Development process stopped${signal ? ` (${signal})` : ''}.`)
      shutdown(code ?? 1)
    }
  })
})

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
