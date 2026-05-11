import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkOrderService, WorkOrderFilters } from '../../services/work-order';
import { WorkOrder } from '../../models/work-order.model';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './work-order-list.html',
  styleUrls: ['./work-order-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderList implements OnInit {
  workOrders: WorkOrder[] = [];
  displayedColumns = ['workOrderNumber', 'title', 'customerName', 'technicianName', 'priority', 'status', 'actions'];
  loading = true;
  errorMessage: string | null = null;
  activeFilters: WorkOrderFilters = {};

  constructor(
    private workOrderService: WorkOrderService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // React to filter changes from the URL (e.g. clicking different stat cards).
    this.route.queryParamMap.subscribe((params) => {
      this.activeFilters = {
        status: params.get('status') ?? undefined,
        priority: params.get('priority') ?? undefined,
        search: params.get('search') ?? undefined,
      };
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;
    this.cdr.markForCheck();
    this.workOrderService.getAll(this.activeFilters).subscribe({
      next: (data) => {
        this.workOrders = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get hasActiveFilter(): boolean {
    return !!(this.activeFilters.status || this.activeFilters.priority || this.activeFilters.search);
  }

  get filterLabel(): string {
    const parts: string[] = [];
    if (this.activeFilters.status) parts.push(`Status: ${this.activeFilters.status}`);
    if (this.activeFilters.priority) parts.push(`Priority: ${this.activeFilters.priority}`);
    if (this.activeFilters.search) parts.push(`Search: "${this.activeFilters.search}"`);
    return parts.join(' · ');
  }

  clearFilters(): void {
    this.router.navigate(['/workorders']);
  }

  edit(id: number): void {
    this.router.navigate(['/workorders/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Delete this work order?')) return;
    this.workOrderService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Deleted!', 'Close', { duration: 3000 });
        this.load();
      },
      error: (err: Error) => {
        this.snackBar.open(err.message, 'Close', { duration: 5000 });
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'In Progress': return '#ff9800';
      case 'New': return '#2196f3';
      default: return '#9e9e9e';
    }
  }
}
