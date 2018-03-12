export const OrderStatus = {
  'pending': 0,
  'partial receive': 1,
  'receive': 2,
  'backorder': 3,
  'reconcile': 4,
  'void': 9,
  'archive': 10,
  'multiple': 100,
};

export const OrderStatusValues = {
  'pending': 'pending',
  'partial receive': 'partial receive',
  'receive': 'receive',
  'backorder': 'backorder',
  'reconcile': 'reconcile',
  'void': 'void',
  'archive': 'archive',
  'multiple': 'multiple',
};

export const OrderStatusAlreadyValues = {
  'pending': 'Pending',
  'receive': 'Received',
  'backorder': 'Backordered',
  'reconcile': 'Reconciled',
  'void': 'Voided',
  'archive': 'Archived',
  'multiple': 'Multiple',
};
