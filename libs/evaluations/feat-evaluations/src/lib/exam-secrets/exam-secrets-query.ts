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
            parentRecord{
                id
            }
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
