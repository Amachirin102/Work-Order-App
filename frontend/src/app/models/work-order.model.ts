export interface WorkOrder {
  id?: number;
  workOrderNumber?: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  customerName: string;
  technicianName?: string | null;
  estimatedCost?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  highPriority: number;
}