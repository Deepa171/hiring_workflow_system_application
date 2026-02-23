import { Component  } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Candidate } from '../../services/candidate';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-form',
   standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './candidate-form.html',
  styleUrl: './candidate-form.scss',
})
export class CandidateForm {

   candidate = {
    name: '',
    email: '',
    roleApplied: '',
    currentStatus: 'APPLIED',
    notes: [] as string[],
    tags: [] as string[],
    interviewDate: ''
  };

 constructor(
    private candidateService: Candidate,
    private router: Router
  ) {}

  submit() {
    this.candidateService.addCandidate(this.candidate).subscribe({
      next: (res: any) => {
        this.candidate = {
          name: '',
          email: '',
          roleApplied: '',
          currentStatus: 'APPLIED',
          notes: [],
          tags: [],
          interviewDate: ''
        };

        this.router.navigate(['/candidates']);
      },
      error: err =>
        alert(err.error?.message || 'Error adding candidate')
    });
  }
}