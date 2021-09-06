import { core, HexNumber, HexString, Input, Script, utils } from '@ckb-lumos/base';
import { toBuffer } from '@ckitjs/easy-byte';
import { normalizers } from 'ckb-js-toolkit';

function toArrayBuffer(buf: Uint8Array) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buf.length; ++i) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    view[i] = buf[i]!;
  }
  return ab;
}

function toBigUInt64LE(num: HexString | number | bigint) {
  num = BigInt(num);
  const buf = toBuffer('', 8);
  buf.writeBigUInt64LE(num);
  return toArrayBuffer(buf);
}

function generateTypeID(input: Input, outputIndex: HexNumber) {
  const outPointBuf = core.SerializeCellInput(normalizers.NormalizeCellInput(input));
  const outputIndexBuf = toBigUInt64LE(outputIndex);
  const ckbHasher = new utils.CKBHasher();
  ckbHasher.update(outPointBuf);
  ckbHasher.update(outputIndexBuf);
  return ckbHasher.digestHex();
}

export function generateTypeIdScript(input: Input, outputIndex: HexNumber): Script {
  const args = generateTypeID(input, outputIndex);
  return {
    code_hash: '0x00000000000000000000000000000000000000000000000000545950455f4944', // Buffer.from('TYPE_ID')
    hash_type: 'type',
    args,
  };
}
