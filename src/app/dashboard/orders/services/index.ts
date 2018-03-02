import { AllOrdersListService } from './all-orders-list.service';
import { BackorderedListService } from './backordered-list.service';
import { ClosedListService } from './closed-list.service';
import { FavoritedListService } from './favorited-list.service';
import { FlaggedListService } from './flagged-list.service';
import { OpenOrdersListService } from './open-orders-list.service';
import { ReceivedListService } from './received-list.service';

export const ORDER_PROVIDERS = [
  AllOrdersListService,
  BackorderedListService,
  ClosedListService,
  FavoritedListService,
  FlaggedListService,
  OpenOrdersListService,
  ReceivedListService,
];
