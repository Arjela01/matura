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
            modifiedOn
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
                modifiedOn
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
            isFall
            maximumValueWritingScore
            maximumValueMultipleScore
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            modifiedOn
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
            nid
            examSubject
            year
            grade
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            modifiedOn
            examType {
                id
                name
                isFall
                maximumValueWritingScore
                maximumValueMultipleScore
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            examVersion {
                id
                code
                name
                numberOfQuestions
                variant
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            scoreD1
            reasonD1
            yearD1
            subjectNameD1
            scoreD2
            reasonD2
            yearD2
            subjectNameD2
            scoreD3
            reasonD3
            yearD3
            subjectNameD3
            scoreZ1
            reasonZ1
            yearZ1
            subjectNameZ1
            scoreZ2
            reasonZ2
            yearZ2
            subjectNameZ2
            scoreZ3
            reasonZ3
            yearZ3
            subjectNameZ3
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
            modifiedOn
            subjectD1 {
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
                modifiedOn
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
            subjectD2 {
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
                modifiedOn
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
            subjectD3 {
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
                modifiedOn
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
            subjectZ1 {
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
                modifiedOn
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
            subjectZ2 {
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
                modifiedOn
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
            subjectZ3 {
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
                modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            scoreD1
            reasonD1
            yearD1
            subjectNameD1
            scoreD2
            reasonD2
            yearD2
            subjectNameD2
            scoreD3
            reasonD3
            yearD3
            subjectNameD3
            scoreZ1
            reasonZ1
            yearZ1
            subjectNameZ1
            scoreZ2
            reasonZ2
            yearZ2
            subjectNameZ2
            scoreZ3
            reasonZ3
            yearZ3
            subjectNameZ3
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
            modifiedOn
            subjectD1 {
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
                modifiedOn
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
            subjectD2 {
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
                modifiedOn
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
            subjectD3 {
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
                modifiedOn
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
            subjectZ1 {
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
                modifiedOn
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
            subjectZ2 {
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
                modifiedOn
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
            subjectZ3 {
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
                modifiedOn
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
            a1ZCategory {
                name
                id
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
                modifiedOn
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
                modifiedOn
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
            modifiedOn
            examType {
                name
                isFall
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                modifiedOn
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
                modifiedOn
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
            modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                    modifiedOn
                }
                examType {
                    name
                    isFall
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
                    modifiedOn
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
                    modifiedOn
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
                    modifiedOn
                }
            }
            examVersion {
                code
                name
                numberOfQuestions
                variant
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
                modifiedOn
                examType {
                    name
                    isFall
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
                    modifiedOn
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
                    modifiedOn
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
                    modifiedOn
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
            modifiedOn
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
                modifiedOn
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
            examType {
                name
                isFall
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                modifiedOn
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
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            banRemovalDate
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            modifiedOn
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
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
            university {
                name
                id
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
            universityDepartment {
                name
                id
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
            modifiedOn
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
            modifiedOn
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
                modifiedOn
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
            region {
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
            modifiedOn
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
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
export const EXAM_VERSION = `
  query ExamVersion
  ($pagesize: Int, $skip: Int,$where: ExamVersionAuditFilterInput,
   $order:[ExamVersionAuditSortInput!]) {
    examVersion (take: $pagesize, skip: $skip,where: $where,order: $order) {
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
            variant
            id
            isDeleted
            createdIP
            createdOn
            deletedIP
            deletedOn
            modifiedIP
            modifiedOn
            examType {
                name
                isFall
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            modifiedOn
            examType {
                name
                isFall
                maximumValueWritingScore
                maximumValueMultipleScore
                id
                isDeleted
                createdIP
                createdOn
                deletedIP
                deletedOn
                modifiedIP
                modifiedOn
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
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            modifiedOn
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
                modifiedOn
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
                modifiedOn
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
            idCard
            isEAlbaniaApplication
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
            modifiedOn
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
  ['examVersion', EXAM_VERSION],
  ['examSubject', EXAM_SUBJECT],
  ['examSubjectProfile', EXAM_SUBJECT_PROFILE],
  ['examSite', EXAM_SITE],
  ['users', USERS],
]);
