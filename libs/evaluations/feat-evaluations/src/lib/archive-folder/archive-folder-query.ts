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
            parentRecord{
                id
            }
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
                name
            }
            examType {
                name
            }
            profileGroup {
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
