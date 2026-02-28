import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';

import { Candidate } from '../../services/candidate';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { Toast } from '../../services/toast';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user';

interface CandidateData {
  timeline: any;
  _id: string;
  name: string;
  roleApplied: string;
  currentStatus: string;
  notes?: string[];
  tags?: string[];
  interviewDate?: string;
  assignedInterviewer?: string;
}

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    RouterModule
],
  templateUrl: './candidate-list.html',
  styleUrls: ['./candidate-list.css']
})
export class CandidateListComponent implements OnInit {

  // 🔹 AUTH ROLE
  role: string | null = null;

  // 🔹 DATA
  candidates: CandidateData[] = [];

  statuses: string[] = [
    'APPLIED',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEWED',
    'SELECTED',
    'REJECTED'
  ];

candidatesByStatus: Record<string, CandidateData[]> = {
  APPLIED: [],
  SHORTLISTED: [],
  INTERVIEW_SCHEDULED: [],
  INTERVIEWED: [],
  SELECTED: [],
  REJECTED: []
};

  // 🔹 Inputs
  noteInput: Record<string, string> = {};
  tagInput: Record<string, string> = {};
  interviewDateInput: Record<string, string> = {};
  interviewerIdInput: Record<string, string> = {};

  // 🔹 Interviewers
  interviewers: any[] = [];

  // 🔹 Filters
  searchText: string = '';
  filterTag: string = '';

  constructor(
    private candidateService: Candidate,
    private auth: Auth,
     private router: Router,
     private toast: Toast,
     private cd: ChangeDetectorRef,
     private userService: UserService
  ) {}

  ngOnInit(): void {
    this.setUserRole();
    this.loadCandidates();
    if (this.role === 'HR') {
      this.loadInterviewers();
    }
  }

  // 🔹 Load candidates
  setUserRole() {
    this.role = this.auth.getUserRole();
  }

 loadCandidates() {
  this.candidateService.getCandidates().subscribe({
    next: (res: any) => {
      let candidates = res.data || [];
      if (this.role === 'INTERVIEWER') {
        const userId = this.auth.getUserId();
        candidates = candidates.filter((c: any) => c.assignedInterviewer === userId);
      }
      this.candidates = candidates;
      this.groupCandidatesByStatus();
    },
    error: err => {}
  });
}

  loadInterviewers() {
    this.userService.getInterviewers().subscribe({
      next: (res: any) => {
        this.interviewers = res.data || [];
      },
      error: err => {}
    });
  }


  onCandidateAdded(newCandidate: CandidateData) {
    if (!newCandidate || !newCandidate._id) {
      return;
    }

    this.candidates.unshift(newCandidate);
    this.groupCandidatesByStatus();
  }


  groupCandidatesByStatus() {
    this.statuses.forEach(status => {
      this.candidatesByStatus[status].length = 0;
    });

  this.candidates.forEach(candidate => {

    if (
      this.searchText?.trim() &&
      !candidate.name?.toLowerCase().includes(this.searchText.trim().toLowerCase())
    ) {
      return;
    }

    if (
      this.filterTag?.trim() &&
      !candidate.tags?.some(t =>
        t.toLowerCase().includes(this.filterTag.trim().toLowerCase())
      )
    ) {
      return;
    }

    this.candidatesByStatus[candidate.currentStatus]?.push(candidate);
  });

}


  openCandidate(id: string) {
  this.router.navigate(['/candidates', id]);
}

  changeStatus(candidate: CandidateData, status: string) {
    this.candidateService.updateStatus(candidate._id, status).subscribe({
      next: (res: any) => {
        candidate.currentStatus = status;
        this.loadCandidates();
      },
      error: err => alert(err.error?.message || 'Failed to update status')
    });
  }

  drop(event: CdkDragDrop<CandidateData[]>) {
    if (event.previousContainer === event.container) return;

    const candidate = event.previousContainer.data[event.previousIndex];
    const newStatus = event.container.id;

    this.candidateService.updateStatus(candidate._id, newStatus).subscribe({
      next: () => {
        candidate.currentStatus = newStatus;

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        this.groupCandidatesByStatus();
      },
      error: err => alert(err.error.message)
    });
  }

  addNoteToCandidate(candidate: CandidateData) {
    const note = this.noteInput[candidate._id];
    if (!note || note.trim().length < 3) {
  alert('Note must be at least 3 characters');
  return;
}

    this.candidateService.addNote(candidate._id, note).subscribe({
      next: (res: any) => {
        candidate.notes = res.data?.notes || candidate.notes;
        this.noteInput[candidate._id] = '';
      },
      error: err => alert(err.error.message)
    });
  }

  updateTagsForCandidate(candidate: CandidateData) {
    const tags = this.tagInput[candidate._id]
      ?.split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (!tags?.length) {
  alert('Please enter at least one tag');
  return;
}

    this.candidateService.updateTags(candidate._id, tags).subscribe({
      next: (res: any) => {
        candidate.tags = res.data?.tags ||candidate.tags;
        this.tagInput[candidate._id] = '';
        this.groupCandidatesByStatus();
      },
      error: err => alert(err.error.message)
    });
  }

  scheduleInterviewForCandidate(candidate: CandidateData) {
    const date = this.interviewDateInput[candidate._id];
    const interviewerId = this.interviewerIdInput[candidate._id];
    
    if (!date) {
      this.toast.show('Please select interview date');
      return;
    }
    
    if (!interviewerId) {
      this.toast.show('Please select an interviewer');
      return;
    }

    this.candidateService.scheduleInterviewWithInterviewer(candidate._id, date, interviewerId).subscribe({
      next: (res: any) => {
        candidate.interviewDate = res.data?.interviewDate;
        candidate.currentStatus = 'INTERVIEW_SCHEDULED';
        candidate.assignedInterviewer = interviewerId;
        this.interviewDateInput[candidate._id] = '';
        this.interviewerIdInput[candidate._id] = '';
        this.groupCandidatesByStatus();
        this.toast.show('Interview scheduled successfully ✅');
      },
      error: err => this.toast.show(err.error.message || 'Error scheduling interview')
    });
  }

}
