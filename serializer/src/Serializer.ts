import { Loadable, SourceRepository } from '@brentbahry/reflection';

export type Serializable = string | boolean | number | Serializable[] | SerializableObject | CustomSerializableObject
export type SerializableFunction = (...args: Serializable[]) => Promise<Serializable> | Promise<void>
export type NotFunction<T> = T extends Function ? never : T

export type SerializableObject = {
	[key: string]: Serializable
}

export type CustomSerializableObject = {
  __serializerId: string,
}

type CustomSerializerBase = {
  serialize: (object: any) => SerializableObject,
  deserialize: (serialized: any) => any,
}

export type CustomSerializer = Loadable & CustomSerializerBase & {
  id: string,
}

export type ThirdPartyLibCustomSerializer = CustomSerializer & {
  matches: (obj: any) => boolean,
}

const getCustomSerializerMap = () => {
  const customSerializers = SourceRepository.get().objects<CustomSerializer>('@proteinjs/serializer/CustomSerializer');
  const customSerializerMap: {[id: string]: CustomSerializer} = {};
  customSerializers.forEach(serializer => customSerializerMap[serializer.id] = serializer);
  return customSerializerMap;
}

const getThirdPartyLibCustomSerializers = () => SourceRepository.get().objects<ThirdPartyLibCustomSerializer>('@proteinjs/serializer/ThirdPartyLibCustomSerializer');

export class Serializer {
  private static customSerializerMap: {[id: string]: CustomSerializer};
  private static thirdPartyLibCustomSerializers: ThirdPartyLibCustomSerializer[];

  private static getCustomSerializerMap() {
    if (!Serializer.customSerializerMap)
      Serializer.customSerializerMap = getCustomSerializerMap();

    return Serializer.customSerializerMap;
  }

  private static getThirdPartyLibCustomSerializers() {
    if (!Serializer.thirdPartyLibCustomSerializers)
      Serializer.thirdPartyLibCustomSerializers = getThirdPartyLibCustomSerializers();

    return Serializer.thirdPartyLibCustomSerializers;
  }

  static serialize(serializable: any): string {
    return JSON.stringify(Serializer._serialize(serializable), null, 2);
  }

  private static _serialize(serializable: any) {
    let serialized = serializable;
    if (serializable == null)
      return serializable;

    if (typeof serializable === 'object' && typeof serializable.__serializerId === 'string') {
      const serializer = Serializer.getCustomSerializerMap()[serializable.__serializerId];
      if (serializer)
        serialized = Object.assign({ __serializerId: serializer.id }, serializer.serialize(serializable));
    } else if (typeof serializable === 'object' && serializable.constructor.name != 'Array') {
      const thirdPartyLibCustomSerializers = Serializer.getThirdPartyLibCustomSerializers();
      let thirdPartyLibCustomSerializer;
      for (let serializer of thirdPartyLibCustomSerializers) {
        if (serializer.matches(serializable)) {
          thirdPartyLibCustomSerializer = serializer;
          break;
        }
      }
      if (thirdPartyLibCustomSerializer) {
        serialized = Object.assign({ __serializerId: thirdPartyLibCustomSerializer.id }, thirdPartyLibCustomSerializer.serialize(serializable));
      } else {
        serialized = {};
        Object.keys(serializable)
          .filter(prop => serializable.hasOwnProperty(prop))
          .forEach(prop => serialized[prop] = Serializer._serialize(serializable[prop]));
      }
    } else if (typeof serializable === 'object' && serializable.constructor.name == 'Array') {
      serialized = serializable.map((item: any) => Serializer._serialize(item));
    }

    return serialized;
  }

  static deserialize(serialized: string) {
    if (serialized == 'undefined' || typeof serialized === 'undefined')
      return undefined;

    let parsed = serialized;
    if (typeof parsed === 'string')
      parsed = JSON.parse(parsed);
    if (parsed == null)
      return parsed;

    if (parsed == 'undefined')
      return undefined;

    return Serializer._deserialize(parsed);
  }

  private static _deserialize(parsed: any) {
    let deserialized = parsed;
    if (parsed == null)
      return parsed;

    if (typeof parsed === 'object' && typeof parsed.__serializerId === 'string') {
      const serializer = Serializer.getCustomSerializerMap()[parsed.__serializerId];
      if (serializer)
        deserialized = serializer.deserialize(parsed);
    } else if (typeof parsed === 'object' && parsed.constructor.name != 'Array') {
      deserialized = {};
      Object.keys(parsed)
        .filter(prop => parsed.hasOwnProperty(prop))
        .forEach(prop => deserialized[prop] = Serializer._deserialize(parsed[prop]));
    } else if (typeof parsed === 'object' && parsed.constructor.name == 'Array') {
      deserialized = parsed.map((item: any) => Serializer._deserialize(item));
    }

    return deserialized;
  }
}