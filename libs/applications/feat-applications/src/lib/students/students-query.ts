export const STUDENTS = `
  query Students($skip: Int,$where: StudentAuditFilterInput,
  $order:[StudentAuditSortInput!]) {
    students(skip: $skip,where: $where,order: $order
) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
            parentRecord(id: $parentRecordId){
              id
            }
            studentId
            firstName
            middleName
            lastName
            birthDate
            birthPlace
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
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
