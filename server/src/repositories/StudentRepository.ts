// repositories/StudentRepository.ts
import { Includeable, Op, WhereOptions } from 'sequelize'
import Student, { StudentCreationAttributes, StudentStatus } from '../models/Student'
import BaseRepository, { FindAllOptions, RepositoryFindOptions } from './BaseRepository'

interface StudentSearchOptions {
    studentId?: string
    userId?: number
    departmentId?: number
    programId?: number
    academicSessionId?: number
    status?: StudentStatus | StudentStatus[]
    level?: string | string[]
    admissionDateFrom?: Date
    admissionDateTo?: Date
    graduationDateFrom?: Date
    graduationDateTo?: Date
    cgpaMin?: number
    cgpaMax?: number
}

interface StudentFindAllOptions extends FindAllOptions<Student> {
    search?: StudentSearchOptions
    includeRelations?: ('biodata' | 'department' | 'program' | 'user' | 'academicSession')[]
}

class StudentRepository extends BaseRepository<Student> {
    constructor() {
        super(Student)
    }

    /**
     * Find all students with advanced filtering
     */
    async findAllWithFilters(options: StudentFindAllOptions = {}) {
        const { search = {}, includeRelations = [], ...baseOptions } = options

        // Build where conditions
        const whereConditions: WhereOptions = {}

        if (search.studentId) {
            whereConditions.studentId = { [Op.iLike]: `%${search.studentId}%` }
        }

        if (search.userId) {
            whereConditions.userId = search.userId
        }

        if (search.departmentId) {
            whereConditions.departmentId = search.departmentId
        }

        if (search.programId) {
            whereConditions.programId = search.programId
        }

        if (search.academicSessionId) {
            whereConditions.academicSessionId = search.academicSessionId
        }

        if (search.status) {
            if (Array.isArray(search.status)) {
                whereConditions.status = { [Op.in]: search.status }
            } else {
                whereConditions.status = search.status
            }
        }

        if (search.level) {
            if (Array.isArray(search.level)) {
                whereConditions.level = { [Op.in]: search.level }
            } else {
                whereConditions.level = search.level
            }
        }

        if (search.admissionDateFrom || search.admissionDateTo) {
            const dateRange: any = {}
            if (search.admissionDateFrom) dateRange[Op.gte] = search.admissionDateFrom
            if (search.admissionDateTo) dateRange[Op.lte] = search.admissionDateTo
            whereConditions.admissionDate = dateRange
        }

        if (search.graduationDateFrom || search.graduationDateTo) {
            const dateRange: any = {}
            if (search.graduationDateFrom) dateRange[Op.gte] = search.graduationDateFrom
            if (search.graduationDateTo) dateRange[Op.lte] = search.graduationDateTo
            whereConditions.graduationDate = dateRange
        }

        if (search.cgpaMin !== undefined || search.cgpaMax !== undefined) {
            const cgpaRange: any = {}
            if (search.cgpaMin !== undefined) cgpaRange[Op.gte] = search.cgpaMin
            if (search.cgpaMax !== undefined) cgpaRange[Op.lte] = search.cgpaMax
            whereConditions.cgpa = cgpaRange
        }

        // Build include array
        const include: Includeable[] = []

        if (includeRelations.includes('biodata')) {
            include.push({
                association: 'biodata',
                required: false,
            })
        }

        if (includeRelations.includes('department')) {
            include.push({
                association: 'department',
                required: false,
            })
        }

        if (includeRelations.includes('program')) {
            include.push({
                association: 'program',
                required: false,
            })
        }

        if (includeRelations.includes('user')) {
            include.push({
                association: 'user',
                required: false,
            })
        }

        if (includeRelations.includes('academicSession')) {
            include.push({
                association: 'academicSession',
                required: false,
            })
        }

        return this.findAll({
            where: whereConditions,
            include,
            ...baseOptions,
        })
    }

    /**
     * Find student by student ID (not primary key)
     */
    async findByStudentId(
        studentId: string,
        options: RepositoryFindOptions<Student> = {}
    ): Promise<Student | null> {
        return this.findOne({ studentId }, options)
    }

    /**
     * Find student by user ID
     */
    async findByUserId(
        userId: number,
        options: RepositoryFindOptions<Student> = {}
    ): Promise<Student | null> {
        return this.findOne({ userId }, options)
    }

    /**
     * Find students by department
     */
    async findByDepartment(
        departmentId: number,
        options: StudentFindAllOptions = {}
    ) {
        return this.findAllWithFilters({
            ...options,
            search: { ...options.search, departmentId },
        })
    }

    /**
     * Find students by program
     */
    async findByProgram(
        programId: number,
        options: StudentFindAllOptions = {}
    ) {
        return this.findAllWithFilters({
            ...options,
            search: { ...options.search, programId },
        })
    }

    /**
     * Find students by academic session
     */
    async findByAcademicSession(
        academicSessionId: number,
        options: StudentFindAllOptions = {}
    ) {
        return this.findAllWithFilters({
            ...options,
            search: { ...options.search, academicSessionId },
        })
    }

    /**
     * Find active students
     */
    async findActiveStudents(options: StudentFindAllOptions = {}) {
        return this.findAllWithFilters({
            ...options,
            search: { ...options.search, status: StudentStatus.ACTIVE },
        })
    }

    /**
     * Find graduated students
     */
    async findGraduatedStudents(options: StudentFindAllOptions = {}) {
        return this.findAllWithFilters({
            ...options,
            search: { ...options.search, status: StudentStatus.GRADUATED },
        })
    }

    /**
     * Find students by level
     */
    async findByLevel(
        level: string | string[],
        options: StudentFindAllOptions = {}
    ) {
        return this.findAllWithFilters({
            ...options,
            search: { ...options.search, level },
        })
    }

    /**
     * Update student status
     */
    async updateStatus(
        studentId: number,
        status: StudentStatus,
        graduationDate?: Date
    ): Promise<Student | null> {
        const updateData: any = { status }

        if (status === StudentStatus.GRADUATED && graduationDate) {
            updateData.graduationDate = graduationDate
        }

        return this.updateById(studentId, updateData)
    }

    /**
     * Update student CGPA
     */
    async updateCGPA(studentId: number, cgpa: number): Promise<Student | null> {
        return this.updateById(studentId, { cgpa })
    }

    /**
     * Update student level
     */
    async updateLevel(studentId: number, level: string): Promise<Student | null> {
        return this.updateById(studentId, { level })
    }

    /**
     * Bulk update student levels (for promotion)
     */
    async promoteStudents(
        studentIds: number[],
        newLevel: string
    ): Promise<number> {
        return this.bulkUpdate(
            studentIds.map(id => ({ id, level: newLevel }))
        )
    }

    /**
     * Get student statistics by department
     */
    async getStatsByDepartment(departmentId: number) {
        const students = await this.findByDepartment(departmentId)

        return {
            total: students.total,
            active: students.data.filter(s => s.status === StudentStatus.ACTIVE).length,
            graduated: students.data.filter(s => s.status === StudentStatus.GRADUATED).length,
            suspended: students.data.filter(s => s.status === StudentStatus.SUSPENDED).length,
            withdrawn: students.data.filter(s => s.status === StudentStatus.WITHDRAWN).length,
            inactive: students.data.filter(s => s.status === StudentStatus.INACTIVE).length,
            byLevel: {
                '100': students.data.filter(s => s.level === '100').length,
                '200': students.data.filter(s => s.level === '200').length,
                '300': students.data.filter(s => s.level === '300').length,
                '400': students.data.filter(s => s.level === '400').length,
                '500': students.data.filter(s => s.level === '500').length,
                '600': students.data.filter(s => s.level === '600').length,
            }
        }
    }

    /**
     * Check if student ID is available
     */
    async isStudentIdAvailable(studentId: string): Promise<boolean> {
        const existing = await this.findByStudentId(studentId)
        return !existing
    }

    /**
     * Generate next student ID for a department/program
     * This is a simple implementation - adjust based on your ID format requirements
     */
    async generateStudentId(
        departmentCode: string,
        year: string,
        sequence?: number
    ): Promise<string> {
        if (!sequence) {
            // Get the last student ID for this department and year
            const lastStudent = await this.findOne(
                {
                    studentId: {
                        [Op.like]: `${departmentCode}/${year}/%`,
                    },
                },
                {
                    order: [['studentId', 'DESC']],
                }
            )

            if (lastStudent) {
                const lastSequence = parseInt(lastStudent.studentId.split('/')[2]) || 0
                sequence = lastSequence + 1
            } else {
                sequence = 1
            }
        }

        const paddedSequence = sequence.toString().padStart(4, '0')
        return `${departmentCode}/${year}/${paddedSequence}`
    }

    /**
     * Create student with auto-generated student ID
     */
    async createWithGeneratedId(
        data: Omit<StudentCreationAttributes, 'studentId'> & {
            departmentCode: string
            admissionYear?: string
        }
    ): Promise<Student> {
        const { departmentCode, admissionYear, ...studentData } = data
        const year = admissionYear || new Date().getFullYear().toString()

        // Generate unique student ID
        let studentId = await this.generateStudentId(departmentCode, year)
        let attempts = 0
        const maxAttempts = 10

        while (!(await this.isStudentIdAvailable(studentId)) && attempts < maxAttempts) {
            attempts++
            const newSequence = parseInt(studentId.split('/')[2]) + attempts
            studentId = await this.generateStudentId(departmentCode, year, newSequence)
        }

        if (attempts >= maxAttempts) {
            throw new Error('Unable to generate unique student ID after multiple attempts')
        }

        return this.create({
            ...studentData,
            studentId,
        })
    }
}

export default StudentRepository
export { StudentFindAllOptions, StudentSearchOptions }
