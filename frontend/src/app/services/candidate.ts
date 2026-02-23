import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Candidate {
  
  private baseUrl = 'http://localhost:5000/api/candidates';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  constructor(private http: HttpClient) {}

  // Fetch all candidates
  getCandidates(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(this.baseUrl,{
      headers : {
        Authorization : `Bearer ${token}`
      }
    });
  }

  getCandidateById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`,this.getAuthHeaders());
  }

  addCandidate(candidate: any): Observable<any> {
    return this.http.post(this.baseUrl, candidate ,this.getAuthHeaders());
  }

  updateStatus(id: string, status: string){
    return this.http.put(`${this.baseUrl}/${id}/status`, { status }, this.getAuthHeaders());
  }

    addNote(id: string, note: string) {
    return this.http.patch(`${this.baseUrl}/${id}/add-note`, { note }, this.getAuthHeaders());
  }

    updateTags(id: string, tags: string[]) {
    return this.http.patch(`${this.baseUrl}/${id}/update-tags`, { tags }, this.getAuthHeaders());
  }

    scheduleInterview(id: string, date: string) {
    return this.http.patch(`${this.baseUrl}/${id}/schedule-interview`, { interviewDate: date },this.getAuthHeaders());
  }

    scheduleInterviewWithInterviewer(id: string, interviewDate: string, interviewerId: string) {
    return this.http.put(`${this.baseUrl}/${id}/schedule`, { interviewDate, interviewerId }, this.getAuthHeaders());
  }

    submitFeedback(id: string, feedback: any) {
    return this.http.post(
      `${this.baseUrl}/${id}/feedback`,
      feedback, this.getAuthHeaders()
    );
  }

    deleteCandidate(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

    uploadResume(id: string, formData: FormData) {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/${id}/upload-resume`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteResume(id: string) {
  return this.http.delete(`${this.baseUrl}/${id}/resume`, this.getAuthHeaders());
}

}
