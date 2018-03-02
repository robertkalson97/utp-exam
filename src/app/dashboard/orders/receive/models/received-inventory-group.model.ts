export class ReceivedInventoryGroupModel {
  id: string;
  locations: ReceivedInventoryGroupLocationModel[];
  name: string;
}

export class ReceivedInventoryGroupLocationModel {
  id: string;
  location_id: string;
  name: string;
  storage_locations: ReceivedInventoryGroupStorageLocationModel[];
}

export class ReceivedInventoryGroupStorageLocationModel {
  id: string;
  name: string;
}
