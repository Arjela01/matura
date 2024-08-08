export const ADMINISTRATION_OFFICE_QUERY = `
  query AdministrationOffice
  ($pagesize: Int,$skip: Int,$where: AdministrationOfficeAuditFilterInput,
  $order:[AdministrationOfficeAuditSortInput!]) {
    administrationOffice(take: $pagesize, skip: $skip,
    where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
        items {
            id
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            name
            directorName
            isRegionalOffice
            parentOfficeId
            isAllowedToLogin
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            parentOffice {
                id
                name
                directorName
                isRegionalOffice
                parentOfficeId
                isAllowedToLogin
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                created {
                    displayName
                }
                modified {
                    displayName
                }
                deleted {
                    displayName
                }
            }
            city {
                name
            }
            created {
                displayName
            }
            modified {
                displayName
            }
            deleted {
                displayName
            }
        }
    }
  }
`;
export const EXAM_TYPE_QUERY = `
   query ExamType ($pagesize: Int, $skip: Int,$where: ExamTypeAuditFilterInput,
    $order:[ExamTypeAuditSortInput!]){
   examType(
   skip: $skip
   take: $pagesize
   where: $where
   order: $order

 ) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
        items {
            id
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            name
            maximumValueWritingScore
            maximumValueMultipleScore
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            created {
                displayName
            }
            modified {
                displayName
            }
            deleted {
                displayName
            }
        }
    }
  }
`;

export const EXAM_GRADE_REQUEST_QUERY = `
  query ExamGradeRequest($pagesize: Int, $skip: Int,$where: ExamGradesRequestAuditFilterInput,
  $order:[ExamGradesRequestAuditSortInput!]) {
    examGradesRequest(take: $pagesize, skip: $skip,where: $where,order: $order
)  {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
        items {
            id
            maturaId
            idCard
            firstName
            lastName
            description
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            created {
                displayName
            }
            modified {
                displayName
            }
            deleted {
                displayName
            }
        }
    }
  }
`;

export const CARRIED_GRADE = `
  query CarriedGrade
  ($pagesize: Int, $skip: Int,$where: CarriedGradeAuditFilterInput,
    $order:[CarriedGradeAuditSortInput!]) {
    carriedGrade(take: $pagesize, skip: $skip,where: $where, order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            id
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            grade
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
             examGrade {
                id
                grade
             }
             examSubject {
                code
                id
                name
            }
             student {
                id
                idCard
                firstName
                middleName
                lastName
                birthPlace
                studentId
             }
            academicYear {
                isActive
                year
            }
            examType {
                id
                name
            }
        }
      }
    }

`;
export const EXAM_SECRET = `
  query ExamSecret
  ($pagesize: Int, $skip: Int,$where: ExamSecretAuditFilterInput,
    $order:[ExamSecretAuditSortInput!]) {
    examSecret (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            id
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            barcode
            isFall
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
               student {
                id
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                idCard
                isA2A3
                isEAlbaniaApplication
                lastName
                middleName
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                created {
                    displayName
                }
                modified {
                    displayName
                }
                deleted {
                    displayName
                }
            }
                examSubject {
                id
                code
                name
                credits
                isOptional
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                created {
                    displayName
                }
                modified {
                    displayName
                }
                deleted {
                    displayName
                }
            }
            deleted {
                displayName
            }
            modified {
                displayName
            }
            created {
                displayName
            }
        }

       }
       }
          `;
export const EXAM_SCORE = `
  query ExamScore
  ($pagesize: Int, $skip: Int,$where: ExamScoreAuditFilterInput,
   $order:[ExamScoreAuditSortInput!]) {
    examScore (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            id
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            barcode
            writingScore
            multipleChoiceScore
            modificationReason
            documentName
            isGradeCalculated
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            examSecret {
                id
                barcode
                isFall
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                created {
                    displayName
                }
                modified {
                    displayName
                }
                deleted {
                    displayName
                }
            }
            examSubject {
                id
                code
                name
                credits
                isOptional
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            created {
                    displayName
                }
                modified {
                    displayName
                }
                deleted {
                    displayName
                }
            }
            created {
                displayName
            }
            modified {
                displayName
            }
            deleted {
                displayName
            }
        }
       }
       }
       `;
export const A1_FORMS = `
  query A1Forms($pagesize: Int, $skip: Int,$where: A1Z1FormAuditFilterInput,
  $order:[A1Z1FormAuditSortInput!]) {
    a1Forms(take: $pagesize, skip: $skip,where: $where,order: $order
) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
        id
        yearOfSchoolA1Z
        isApplyingToForeignCountries
        alreadyHaveDiploma
        isEAlbaniaApplication
        isA1
        printedOn
        carriedGradeD1 {
            grade
            reason
        }
        carriedGradeD2 {
            grade
            reason
        }
        carriedGradeD3 {
             grade
             reason
        }
        carriedGradeZ1 {
             grade
             reason
        }
        subjectD1 {
            name
        }
        subjectD2 {
            name
        }
        subjectD3 {
            name
        }
        subjectZ1 {
            name
        }
        subjectZ2 {
            name
        }
        subjectZ3 {
            name
        }
        academicYear {
            year
        }
        student {
            studentId
            firstName
            middleName
            lastName
            idCard
        }
        isDeleted
        createdIP
        createdOn
        modifiedIP
        deletedIP
        deletedOn
        auditHostname
        auditSIDUsername
        auditUsername
        auditOperation
        auditTimestamp
    }
  }
}
      `;
export const A1Z_FORMS = `
  query A1ZForms($pagesize: Int, $skip: Int,$where: A1Z1FormAuditFilterInput,
    $order:[A1Z1FormAuditSortInput!]) {
    a1ZForms(take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
            items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            yearOfSchoolA1Z
            isApplyingToForeignCountries
            alreadyHaveDiploma
            isEAlbaniaApplication
            isA1
            printedOn
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
               carriedGradeD1 {
                id
                grade
                reason
            }
            carriedGradeD2 {
                id
                grade
                reason
            }
            carriedGradeD3 {
                 id
                 grade
                 reason
            }
            carriedGradeZ1 {
                 id
                 grade
                 reason
            }
            subjectD1 {
                name
            }
            subjectD2 {
                name
            }
            subjectD3 {
                name
            }
            subjectZ1 {
                name
            }
            subjectZ2 {
                name
            }
            subjectZ3 {
                name
            }
            a1ZCategory {
                name
            }
            academicYear {
                isActive
                year
                id
            }
            student {
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                middleName
                lastName
                idCard
                isA2A3
                isEAlbaniaApplication
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
}
}
`;
export const EXAM_DATE = `
  query ExamDate
  ($pagesize: Int, $skip: Int,$where: ExamDateAuditFilterInput,
  $order:[ExamDateAuditSortInput!]) {
    examDate (take: $pagesize, skip: $skip,where: $where, order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            date
            time
            id
            isDeleted
            createdBy
            createdIP
            createdOn
            deletedBy
            deletedIP
            deletedOn
            modifiedBy
            modifiedIP
            examType {
                name
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            academicYear {
                isActive
                year
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
}
}
`;
export const EXAM_COPY_REQUEST = `
  query ExamCopyRequest
  ($pagesize: Int, $skip: Int,$where: ExamCopyRequestAuditFilterInput,
  $order:[ExamCopyRequestAuditSortInput!]) {
    examCopyRequest (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            applicationId
            maturaId
            nid
            firstName
            fatherName
            lastName
            gender
            dateOfBirth
            email
            cel
            telFix
            placeOfBirth
            nationality
            region
            city
            address
            postalCode
            schoolName
            schoolCode
            administrationOffice
            service
            comments
            remarks
            subject
            documentName
            status
            dateCreated
            decisionDate
            decisionDueDate
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }
}
}
`;
export const EXAM_ASSIGNMENT = `
  query ExamAssignment
  ($pagesize: Int, $skip: Int,$where: ExamAssignmentAuditFilterInput,
  $order:[ExamAssignmentAuditSortInput!]) {
    examAssignment (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            student {
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                idCard
                isA2A3
                isEAlbaniaApplication
                lastName
                middleName
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            examDate {
                date
                time
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
          }
         }
       }
       `;
export const ARCHIVE_EXAM = `
  query ArchiveExam
  ($pagesize: Int, $skip: Int,$where: ArchiveExamAuditFilterInput,
    $order:[ArchiveExamAuditSortInput!]) {
    archiveExam (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            index
            barcode
            id
            isDeleted
            createdBy
            createdIP
            createdOn
            deletedBy
            deletedIP
            deletedOn
            modifiedBy
            modifiedIP
            archiveFolder {
                nr
                isClosed
                totalArchiveExams
                lastUserId
                id
                isDeleted
                createdBy
                createdIP
                createdOn
                deletedBy
                deletedIP
                deletedOn
                modifiedBy
                modifiedIP
                examSubject {
                    code
                    name
                    credits
                    isOptional
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
                examType {
                    name
                    maximumValueWritingScore
                    maximumValueMultipleScore
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
                academicYear {
                    isActive
                    year
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
                profileGroup {
                    name
                    ordering
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
                examType {
                    name
                    maximumValueWritingScore
                    maximumValueMultipleScore
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
                examSubject {
                    code
                    name
                    credits
                    isOptional
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
                profileGroup {
                    name
                    ordering
                    id
                    isDeleted
                    createdBy
                    createdIP
                    createdOn
                    deletedBy
                    deletedIP
                    deletedOn
                    modifiedBy
                    modifiedIP
                }
            }
        }


       }
       }
       `;
export const ARCHIVE_FOLDER = `
  query ArchiveFolder
  ($pagesize: Int, $skip: Int,$where: ArchiveFolderAuditFilterInput,
   $order:[ArchiveFolderAuditSortInput!]) {
    archiveFolder (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            nr
            isClosed
            totalArchiveExams
            lastUserId
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            examSubject {
                code
                name
                credits
                isOptional
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            examType {
                name
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            profileGroup {
                name
                ordering
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }

}
}
`;
export const AVERAGE_GRADE = `
  query AverageGrade
  ($pagesize: Int, $skip: Int,$where: AverageGradeAuditFilterInput,
   $order:[AverageGradeAuditSortInput!]) {
    averageGrade (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            grade
            hasStudiedAbroad
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            student {
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                idCard
                isA2A3
                isEAlbaniaApplication
                lastName
                middleName
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            academicYear {
                isActive
                year
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
         }
        }
       }
       `;
export const PROFILE_GROUP = `
  query ProfileGroup
  ($pagesize: Int, $skip: Int,$where: ProfileGroupAuditFilterInput,
  $order:[ProfileGroupAuditSortInput!]) {
    profileGroup (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            name
            ordering
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }
       }
     }
       `;
export const PROFILE = `
  query Profile
  ($pagesize: Int, $skip: Int,$where: ProfileAuditFilterInput,
   $order:[ProfileAuditSortInput!]) {
    profile (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
       items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            code
            name
            isTechnical
            d1Coefficient
            d2Coefficient
            fullName
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            academicYear {
                isActive
                year
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            profileGroup {
                name
                ordering
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
      }
    }
       `;
export const STUDENT_BAN = `
  query StudentBan
  ($pagesize: Int, $skip: Int,$where: StudentBanAuditFilterInput,
   $order:[StudentBanAuditSortInput!]) {
    studentBan (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            description
            isBanned
            effectiveDate
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            student {
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                idCard
                isA2A3
                isEAlbaniaApplication
                lastName
                middleName
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
       }
       }
      `;
export const STUDY_PROGRAM = `
  query StudyProgram
  ($pagesize: Int, $skip: Int,$where: StudyProgramAuditFilterInput,
   $order:[StudyProgramAuditSortInput!]) {
    studyProgram (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            name
            code
            isTwoYearLong
            minAverageGrade
            quota
            usedQuota
            fullName
            maturaCoefficient
            isWithCompetition
            isValidForRace
            competitionMaxScore
            competitionMinScore
            competitionCoefficient
            dropDownName
            studentScores
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            academicYear {
                isActive
                year
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            university {
                name
                id
            }
            universityDepartment {
                name
                id
            }
        }

}
}
`;
export const STUDY_SUBJECT = `
  query StudySubject
  ($pagesize: Int, $skip: Int,$where: StudySubjectAuditFilterInput,
   $order:[StudySubjectAuditSortInput!]) {
    studySubject (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            code
            name
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }
    }
       }`;
export const HIGH_SCHOOL = `
  query HighSchool
  ($pagesize: Int, $skip: Int,$where: HighSchoolAuditFilterInput,
    $order:[HighSchoolAuditSortInput!]) {
    highSchool (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            code
            name
            isPublic
            administrationOfficeId
            cityId
            regionId
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            administrationOffice {
                name
                directorName
                isRegionalOffice
                parentOfficeId
                isAllowedToLogin
                id
                isDeleted
                }
            city {
                name
                }
            region {
                name
            }
        }
       }
       }
       `;
export const GRADE_SCALE = `
  query GradeScale
  ($pagesize: Int, $skip: Int,$where: GradeScaleAuditFilterInput,
  $order:[GradeScaleAuditSortInput!]) {
    gradeScale (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            score
            grade
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
           examSubject {
                code
                name
                credits
                isOptional
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
       }
       }
       `;
export const FAILING_STUDENT = `
  query FailingStudent
  ($pagesize: Int, $skip: Int,$where: FailingStudentAuditFilterInput,
   $order:[FailingStudentAuditSortInput!]) {
    failingStudent (take: $pagesize, skip: $skip,where: $where, order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
       items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            subject
            willRetryInFall
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            student {
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                idCard
                isA2A3
                isEAlbaniaApplication
                lastName
                middleName
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
       }
       }
       `;
export const EXAM_VARIANT = `
  query ExamVariant
  ($pagesize: Int, $skip: Int,$where: ExamVariantAuditFilterInput,
   $order:[ExamVariantAuditSortInput!]) {
    examVariant (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            code
            name
            numberOfQuestions
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            examType {
                name
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            examSubject {
                code
                name
                credits
                isOptional
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            profileGroup {
                name
                ordering
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }

       }
       }
       `;
export const EXAM_SUBJECT = `
  query ExamSubject
  ($pagesize: Int, $skip: Int,$where: ExamSubjectAuditFilterInput,
   $order:[ExamSubjectAuditSortInput!]) {
    examSubject (take: $pagesize, skip: $skip,where: $where, order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            code
            name
            credits
            isOptional
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            examType {
                name
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            academicYear {
                isActive
                year
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
       }
       }
       `;
export const EXAM_SUBJECT_PROFILE = `
  query ExamSubjectProfile
  ($pagesize: Int, $skip: Int,$where: ExamSubjectProfileAuditFilterInput,
   $order:[ExamSubjectProfileAuditSortInput!]) {
    examSubjectProfile (take: $pagesize, skip: $skip,where: $where,
    order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            examSubject {
                code
                name
                credits
                isOptional
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            profile {
                code
                name
                isTechnical
                d1Coefficient
                d2Coefficient
                fullName
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
}
}`;
export const EXAM_SITE = `
  query ExamSite
  ($pagesize: Int, $skip: Int,$where: ExamSiteAuditFilterInput,
    $order:[ExamSiteAuditSortInput!]) {
    examSite (take: $pagesize, skip: $skip,where: $where,order: $order) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
       items {
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            name
            address
            quota
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedBy
            modifiedIP
            academicYear {
                isActive
                year
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            administrationOffice {
                name
                directorName
                isRegionalOffice
                parentOfficeId
                isAllowedToLogin
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
        }
       }
       }`;
export const USERS = `
  query Users {
    users {
        id
        name
    }
  }
`;
export const STUDENTS = `
  query Students($pagesize: Int, $skip: Int,$where: StudentAuditFilterInput,
  $order:[StudentAuditSortInput!]) {
    students(take: $pagesize, skip: $skip,where: $where,order: $order
) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            studentId
            firstName
            middleName
            lastName
            auditOperation
            auditHostname
            auditSIDUsername
            auditUsername
            auditTimestamp
            idCard
            isEAlbaniaApplication
            isDiplomaRequirementException
            isFall
            isPrinted
            diplomaPrintedDate
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }

      }
      }


`;

export const regradingRequest = `
  query RegradingRequest
  ($pagesize: Int, $skip: Int,$where: RegradingRequestAuditFilterInput,
   $order:[RegradingRequestAuditSortInput!]) {
    regradingRequest (take: $pagesize, skip: $skip,where: $where,
    order: $order){
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
        student {
                birthDate
                birthPlace
                isConfirmedBySupervisor
                isAN
                email
                firstName
                idCard
                isA2A3
                isEAlbaniaApplication
                lastName
                middleName
                mobilePhone
                oldID
                schoolFinished
                schoolName
                session
                studentId
                studyClass
                graduationYear
                isFall
                isPrinted
                diplomaPrintedDate
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
            }
            examSubject
            {
            name
            id
            }
            examType
            {
            id
            name
            }
            auditOperation
            auditHostname
            auditSIDUsername
            auditUsername
            auditTimestamp
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }


      }
      }


`;

export const examQuestionScoreTotal = `
   query ExamQuestionScoreTotal
  ($pagesize: Int, $skip: Int,$where: ExamQuestionScoreTotalAuditFilterInput,
   $order:[ExamQuestionScoreTotalAuditSortInput!]) {
    ExamQuestionScoreTotal (take: $pagesize, skip: $skip,where: $where,
    order: $order){
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            examType{
            id
            name
            }
            examVariant{
            id
            name
            barcode
            testNumber
            totalScore
            }
            examSubject{
            id
            name
            }
            academicYear{
            id
            name
            }
            auditOperation
            auditHostname
            auditSIDUsername
            auditUsername
            auditTimestamp
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }
        modified {
                displayName
            }
            deleted {
                displayName
            }

      }
      }


`;

export const diploma = `
  query Diploma($pagesize: Int, $skip: Int,$where: DiplomaFilterInput,
  $order:[DiplomaFilterInput!]) {
    diploma(take: $pagesize, skip: $skip,where: $where,order: $order
) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            studentStudentId
            studentMiddleName
            studentLastName
            studentIdCard
            studentId
            studentFirstName
            printedDate
            isSealError
            isPrinted
            isDeliveryError
            isDelivered
            highSchoolName
            eAlbaniaDocumentResponse
            deliveryDate
            countryName
            administrationOfficeName
            academicYearName
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }
        modified {
                displayName
            }
            deleted {
                displayName
            }

      }
      }


`;

export const dataExport = `
 query DataExport
  ($pagesize: Int, $skip: Int,$where: DataExportAuditFilterInput,
   $order:[DataExportAuditSortInput!]) {
    dataExport (take: $pagesize, skip: $skip,where: $where,
    order: $order){
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            query
            name
            isVisible
            isFall
            displayOrder
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }

      }
      }


`;
export const ealbaniaMessage = `
  query EalbaniaMessage($pagesize: Int, $skip: Int,$where: EalbaniaMessageFilterInput,
  $order:[EalbaniaMessageFilterInput!]) {
    ealbaniaMessage(take: $pagesize, skip: $skip,where: $where,order: $order
) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            query
            name
            isVisible
            isFall
            displayOrder
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
        }
        modified {
                displayName
            }
            deleted {
                displayName
            }

      }
      }


`;

export const queriesMap: Map<string, string> = new Map([
  ['a1Forms', A1_FORMS],
  ['students', STUDENTS],
  ['administrationOffice', ADMINISTRATION_OFFICE_QUERY],
  ['examType', EXAM_TYPE_QUERY],
  ['carriedGrade', CARRIED_GRADE],
  ['examSecret', EXAM_SECRET],
  ['examScore', EXAM_SCORE],
  ['examDate', EXAM_DATE],
  ['examCopyRequest', EXAM_COPY_REQUEST],
  ['examAssignment', EXAM_ASSIGNMENT],
  ['a1ZForms', A1Z_FORMS],
  ['archiveExam', ARCHIVE_EXAM],
  ['archiveFolder', ARCHIVE_FOLDER],
  ['averageGrade', AVERAGE_GRADE],
  ['profileGroup', PROFILE_GROUP],
  ['profile', PROFILE],
  ['studentBan', STUDENT_BAN],
  ['studyProgram', STUDY_PROGRAM],
  ['studySubject', STUDY_SUBJECT],
  ['highSchool', HIGH_SCHOOL],
  ['gradeScale', GRADE_SCALE],
  ['failingStudent', FAILING_STUDENT],
  ['examVariant', EXAM_VARIANT],
  ['examSubject', EXAM_SUBJECT],
  ['examSubjectProfile', EXAM_SUBJECT_PROFILE],
  ['examSite', EXAM_SITE],
  ['users', USERS],
  ['examGradesRequest', EXAM_GRADE_REQUEST_QUERY],
  ['regradingRequest', regradingRequest],
  ['examQuestionScoreTotal', examQuestionScoreTotal],
  ['diploma', diploma],
  ['dataExport', dataExport],
  ['ealbaniaMessage', ealbaniaMessage],
]);
