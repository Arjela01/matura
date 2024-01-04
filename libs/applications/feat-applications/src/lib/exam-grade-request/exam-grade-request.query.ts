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
