import { type BinaryLike, createCipheriv, createDecipheriv, scryptSync } from 'node:crypto'
import { compose, type Duplex } from 'node:stream'
import { createGunzip, createGzip } from 'node:zlib'

function createKey(password: string) {
  return scryptSync(password, 'salt', 24)
}

export function createCompressAndEncrypt(password: string, iv: BinaryLike): Duplex {
  const key = createKey(password)
  const combinedStream = compose(
    createGzip(),
    createCipheriv('aes192', key, iv),
  )

  return combinedStream
}

export function createDecryptAndDecompress(password: string, iv: BinaryLike) {
  const key = createKey(password)
  return compose(
    createDecipheriv('aes192', key, iv),
    createGunzip(),
  )
}
