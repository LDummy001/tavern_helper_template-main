import { Datetime } from './datetime';

export class Promise {
  public deadline: Datetime;
  public static readonly DEADLINE_KEY: string = '期限';
  public character_ids: string[];
  public static readonly CHARACTER_IDS_KEY: string = '角色';
  public location_id: string | null;
  public static readonly LOCATION_ID_KEY: string = '地點';
  public description: string;
  public static readonly DESCRIPTION_KEY: string = '內容';

  public constructor(deadline: Datetime, character_ids: string[], location_id: string | null, description: string) {
    this.deadline = deadline;
    this.character_ids = character_ids;
    this.location_id = location_id;
    this.description = description;
  }

  public static fromRecord(record: Record<string, any>): Promise {
    return new Promise(
      Datetime.fromString(record[Promise.DEADLINE_KEY]),
      record[Promise.CHARACTER_IDS_KEY],
      record[Promise.LOCATION_ID_KEY],
      record[Promise.DESCRIPTION_KEY],
    );
  }

  public toRecord(): Record<string, any> {
    return {
      [Promise.DEADLINE_KEY]: this.deadline.toString(),
      [Promise.CHARACTER_IDS_KEY]: this.character_ids,
      [Promise.LOCATION_ID_KEY]: this.location_id,
      [Promise.DESCRIPTION_KEY]: this.description,
    };
  }
}
