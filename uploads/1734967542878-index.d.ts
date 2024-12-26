import { Types } from './Types.js';
import { Charsets } from './Charsets.js';
import { CharsetToEncoding } from './CharsetToEncoding.js';

export { Types, Charsets, CharsetToEncoding };
ypeCastType,
} from './typeCast.js';

export {
  setMaxParserCache,
  clearParserCache,
  TypeCast,
  TypeCastField,
  TypeCastGeometry,
  TypeCastNext,
  TypeCastType,
};
ort { ErrorPacketParams } from './params/ErrorPacketParams.js';

export type QueryResult =
  | OkPacket
  | ResultSetHeader
  | ResultSetHeader[]
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket[]
  | ProcedureCallPacket;

export {
  OkPacket,
  RowDataPacket,
  FieldPacket,
  Field,
  ProcedureCallPacket,
  ResultSetHeader,
  OkPacketParams,
  ErrorPacketParams,
};
