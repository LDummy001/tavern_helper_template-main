export class Location {
  public id: string;
  public static readonly ID_KEY: string = 'id';
  public name: string;
  public static readonly NAME_KEY: string = '地點';
  public location: string;
  public static readonly LOCATION_KEY: string = '位置';
  public description: string;
  public static readonly DESCRIPTION_KEY: string = '描述';
  public parent_location_id: string | null;
  public static readonly PARENT_LOCATION_ID_KEY: string = '父地點id';
  public sub_location_ids: string[];
  public static readonly SUB_LOCATION_IDS_KEY: string = '子地點ids';

  public constructor(
    id: string,
    name: string,
    location: string,
    description: string,
    parent_location_id: string | null,
    sub_location_ids: string[],
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.description = description;
    this.parent_location_id = parent_location_id;
    this.sub_location_ids = sub_location_ids;
  }

  public static fromRecord(record: Record<string, any>): Location {
    return new Location(
      record[Location.ID_KEY],
      record[Location.NAME_KEY],
      record[Location.LOCATION_KEY],
      record[Location.DESCRIPTION_KEY],
      record[Location.PARENT_LOCATION_ID_KEY],
      record[Location.SUB_LOCATION_IDS_KEY] || [],
    );
  }

  public toRecord(): Record<string, any> {
    return {
      [Location.ID_KEY]: this.id,
      [Location.NAME_KEY]: this.name,
      [Location.LOCATION_KEY]: this.location,
      [Location.DESCRIPTION_KEY]: this.description,
      [Location.PARENT_LOCATION_ID_KEY]: this.parent_location_id,
      [Location.SUB_LOCATION_IDS_KEY]: this.sub_location_ids,
    };
  }
}
