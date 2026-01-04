import { Datetime } from './datetime';

export class Promise {
  public deadline: Datetime;
  public static readonly DEADLINE_KEY: string = '期限';
  public character_ids: string[];
  public static readonly CHARACTER_IDS_KEY: string = '角色';
  public location: string;
  public static readonly LOCATION_KEY: string = '地點';
  public description: string;
  public static readonly DESCRIPTION_KEY: string = '內容';

  public constructor(deadline: Datetime, character_ids: string[], location: string, description: string) {
    this.deadline = deadline;
    this.character_ids = character_ids;
    this.location = location;
    this.description = description;
  }

  public static fromRecord(record: Record<string, any>): Promise {
    return new Promise(
      new Datetime(record[Promise.DEADLINE_KEY]),
      record[Promise.CHARACTER_IDS_KEY],
      record[Promise.LOCATION_KEY],
      record[Promise.DESCRIPTION_KEY],
    );
  }

  public toRecord(): Record<string, any> {
    return {
      [Promise.DEADLINE_KEY]: this.deadline.toDate(),
      [Promise.CHARACTER_IDS_KEY]: this.character_ids,
      [Promise.LOCATION_KEY]: this.location,
      [Promise.DESCRIPTION_KEY]: this.description,
    };
  }
}
