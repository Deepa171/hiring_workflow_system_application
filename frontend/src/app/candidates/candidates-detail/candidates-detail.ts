import { Component , OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../services/candidate';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
@Component({
    standalone: true,

  selector: 'app-candidates-detail',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './candidates-detail.html',
  styleUrls: ['./candidates-detail.scss'],
})
export class CandidatesDetailComponent implements OnInit {
  candidate: any;
  role: string | null = null;
  selectedFile: File | null = null;
  feedback = {
    rating: 0,
    comments: '',
    recommendation: ''
  };

  constructor(
    private route: ActivatedRoute,
    private candidateService: Candidate,
      private auth: Auth,
      private cdr: ChangeDetectorRef,
      private router: Router
  ) {
    this.role = this.auth.getUserRole();
  }

  ngOnInit():void {
    const id = this.route.snapshot.paramMap.get('id');
     if (!id) {
    return;
  }

    this.candidateService.getCandidateById(id)
      .subscribe({
      next: (res: any) => {
        this.candidate = res.data;
        this.cdr.detectChanges();
      },
      error: err => {
        alert('Failed to load candidate: ' + (err.error?.message || err.message));
      }
    });
  }

    submitFeedback() {
    if (!this.feedback.rating || !this.feedback.recommendation) {
      alert('Rating and recommendation are required');
      return;
    }

    this.candidateService
      .submitFeedback(this.candidate._id, this.feedback)
      .subscribe({
        next: (res: any) => {
          this.candidate.feedback = res.data.feedback;
          this.candidate.feedbackLocked = true;
          alert('Feedback submitted successfully ✅');
        },
        error: err => alert(err.error.message)
      });
  }

    deleteCandidate() {
    if (!confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    this.candidateService.deleteCandidate(this.candidate._id).subscribe({
      next: () => {
        alert('Candidate deleted successfully');
        this.router.navigate(['/candidates']);
      },
      error: err => alert(err.error?.message || 'Failed to delete candidate')
    });
  }

    onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadResume();
    }
  }

    uploadResume() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('resume', this.selectedFile);

    this.candidateService.uploadResume(this.candidate._id, formData).subscribe({
      next: (res: any) => {
        this.candidate.resume = res.data.resume;
        this.selectedFile = null;
        alert('Resume uploaded successfully ✅');
        this.ngOnInit();
      },
      error: err => alert(err.error?.message || 'Failed to upload resume')
    });
  }

    deleteResume() {
    if (!confirm('Delete resume?')) return;

    this.candidateService.deleteResume(this.candidate._id).subscribe({
      next: () => {
        this.candidate.resume = null;
        alert('Resume deleted');
        this.cdr.detectChanges();
      },
      error: err => alert(err.error?.message || 'Failed to delete resume')
    });
  }

  downloadResume() {
  const token = localStorage.getItem('token');
  window.open(`http://localhost:5000/api/candidates/${this.candidate._id}/resume?token=${token}`, '_blank');
}

}
