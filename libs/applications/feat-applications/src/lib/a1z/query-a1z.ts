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
            parentRecord{
                  id
            }
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
            modifiedOn
            createdBy
            deletedBy
            modifiedBy
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
