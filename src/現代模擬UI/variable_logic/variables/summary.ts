import { Datetime } from './datetime';

export class Summary {
  public datetime: Datetime;
  public static readonly DATETIME_KEY: string = '時間';
  public summary: string;
  public static readonly SUMMARY_KEY: string = '總結';
  public weighting: number;
  public static readonly WEIGHTING_KEY: string = '權重';
  public last_message_id: number;
  public static readonly LAST_MESSAGE_ID_KEY: string = '最後樓層';

  public constructor(datetime: Datetime, summary: string, weighting: number, last_message_id: number) {
    this.datetime = datetime;
    this.summary = summary;
    this.weighting = weighting;
    this.last_message_id = last_message_id;
  }

  public static fromRecord(record: Record<string, any>): Summary {
    return new Summary(
      new Datetime(record[Summary.DATETIME_KEY]),
      record[Summary.SUMMARY_KEY],
      record[Summary.WEIGHTING_KEY],
      record[Summary.LAST_MESSAGE_ID_KEY],
    );
  }

  public toRecord(): Record<string, any> {
    return {
      [Summary.DATETIME_KEY]: this.datetime.toDate(),
      [Summary.SUMMARY_KEY]: this.summary,
      [Summary.WEIGHTING_KEY]: this.weighting,
      [Summary.LAST_MESSAGE_ID_KEY]: this.last_message_id,
    };
  }
}
