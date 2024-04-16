import moment from 'moment';
import { ThirdPartyLibCustomSerializer } from '../Serializer';

type SerializedMoment = {
  value: number,
}

export class MomentSerializer implements ThirdPartyLibCustomSerializer {
  id = '@proteinjs/serializer/MomentSerializer';
  
  matches(obj: any) {
    return moment.isMoment(obj);
  }

  serialize(m: moment.Moment): SerializedMoment {
    return { value: m.valueOf() };
  }

  deserialize(serializedMoment: SerializedMoment): moment.Moment {
    return moment(serializedMoment.value);
  }
}