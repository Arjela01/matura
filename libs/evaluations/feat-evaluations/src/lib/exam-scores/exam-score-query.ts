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
            parentRecord{
                id
            }
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
