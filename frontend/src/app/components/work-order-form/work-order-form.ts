import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkOrderService } from '../../services/work-order';
import { WorkOrder } from '../../models/work-order.model';

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './work-order-form.html',
  styleUrls: ['./work-order-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  workOrderId?: number;
  priorities = ['Low', 'Medium', 'High'];
  statuses = ['New', 'Assigned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private workOrderService: WorkOrderService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      customerName: ['', Validators.required],
      technicianName: [''],
      priority: ['Medium', Validators.required],
      status: ['New', Validators.required],
      estimatedCost: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.workOrderId = +id;
      this.workOrderService.getById(this.workOrderId).subscribe({
        next: (wo) => {
          this.form.patchValue(wo);
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving) return;
    const data: WorkOrder = this.form.value;
    this.saving = true;
    this.cdr.markForCheck();

    const done = (msg: string) => {
      this.snackBar.open(msg, 'Close', { duration: 3000 });
      this.router.navigate(['/workorders']);
    };
    const fail = (err: Error) => {
      this.saving = false;
      this.cdr.markForCheck();
      this.snackBar.open(err.message, 'Close', { duration: 5000 });
    };

    if (this.isEdit && this.workOrderId) {
      this.workOrderService.update(this.workOrderId, { ...data, id: this.workOrderId }).subscribe({
        next: () => done('Work order updated!'),
        error: fail,
      });
    } else {
      this.workOrderService.create(data).subscribe({
        next: () => done('Work order created!'),
        error: fail,
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/workorders']);
  }
}
