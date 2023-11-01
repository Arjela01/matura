export const STUDENTS = `
  query Students($pagesize: Int,$skip: Int,$where: StudentAuditFilterInput,
  $order:[StudentAuditSortInput!]) {
    students(take: $pagesize,skip: $skip,where: $where,order: $order
) {
    totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
       }
        items {
        parentRecord{
            id
       }
            studentId
            firstName
            middleName
            ealbaniaDocsDiplomaPrintedDate
            isDiplomaSealSentToEalbaniaDocs
            diplomaPrintedDate
            isPrinted
            lastName
            birthDate
            birthPlace
            auditHostname
            auditSIDUsername
            auditUsername
            auditOperation
            auditTimestamp
            legacySchoolId
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
