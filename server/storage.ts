import { 
  users, courses, assignments, submissions, enrollments, grades,
  type User, type InsertUser, type Course, type InsertCourse,
  type Assignment, type InsertAssignment, type Submission, type InsertSubmission,
  type Enrollment, type Grade
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getCourse(id: string): Promise<Course | undefined>;
  getCoursesByInstructor(instructorId: string): Promise<Course[]>;
  getEnrolledCourses(studentId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined>;
  
  // Enrollment operations
  enrollStudent(courseId: string, studentId: string): Promise<Enrollment>;
  getEnrollments(courseId: string): Promise<Enrollment[]>;
  
  // Assignment operations
  getAssignment(id: string): Promise<Assignment | undefined>;
  getAssignmentsByCourse(courseId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | undefined>;
  
  // Submission operations
  getSubmission(id: string): Promise<Submission | undefined>;
  getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission | undefined>;
  
  // Grade operations
  getGradeBySubmission(submissionId: string): Promise<Grade | undefined>;
  createGrade(grade: Omit<Grade, 'id' | 'createdAt'>): Promise<Grade>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role as 'student' | 'instructor' | 'administrator',
        studentId: insertUser.studentId || null,
      })
      .returning();
    return user;
  }

  // Course operations
  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.instructorId, instructorId));
  }

  async getEnrolledCourses(studentId: string): Promise<Course[]> {
    return await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        code: courses.code,
        instructorId: courses.instructorId,
        isActive: courses.isActive,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .innerJoin(enrollments, eq(courses.id, enrollments.courseId))
      .where(eq(enrollments.studentId, studentId));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse || undefined;
  }

  // Enrollment operations
  async enrollStudent(courseId: string, studentId: string): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values({ courseId, studentId })
      .returning();
    return enrollment;
  }

  async getEnrollments(courseId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
  }

  // Assignment operations
  async getAssignment(id: string): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.courseId, courseId));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db.insert(assignments).values(assignment).returning();
    return newAssignment;
  }

  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | undefined> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment || undefined;
  }

  // Submission operations
  async getSubmission(id: string): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission || undefined;
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  }

  async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.studentId, studentId));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission | undefined> {
    const [updatedSubmission] = await db
      .update(submissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(submissions.id, id))
      .returning();
    return updatedSubmission || undefined;
  }

  // Grade operations
  async getGradeBySubmission(submissionId: string): Promise<Grade | undefined> {
    const [grade] = await db.select().from(grades).where(eq(grades.submissionId, submissionId));
    return grade || undefined;
  }

  async createGrade(grade: Omit<Grade, 'id' | 'createdAt'>): Promise<Grade> {
    const [newGrade] = await db.insert(grades).values(grade).returning();
    return newGrade;
  }
}

export const storage = new DatabaseStorage();
