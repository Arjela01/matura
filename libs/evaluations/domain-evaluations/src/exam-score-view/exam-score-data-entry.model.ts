import { ExamScore } from '../exam-score/exam-score.model';
import {ArchiveExam} from "../archive-exam/archive-exam.model";

export interface ExamScoreDataEntry {
  examScore: ExamScore;
  archiveExam: ArchiveExam;
}
