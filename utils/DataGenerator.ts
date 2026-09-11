import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Utility to generate unique & meaningful test data for the
 * "Add Student" flow — first name, email, phone number and document number.
 * Values are built using current timestamp + random digits so that
 * two consecutive/parallel test runs never collide.
 */

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Krishna',
  'Ishaan', 'Kabir', 'Rohan', 'Aryan', 'Dhruv', 'Karthik', 'Manav',
  'Nikhil', 'Om', 'Pranav', 'Rudra', 'Sai', 'Shaurya', 'Tanish', 'Yash',
  'Ananya', 'Diya', 'Ishita', 'Kavya', 'Meera', 'Navya', 'Pari',
  'Riya', 'Saanvi', 'Tara', 'Vanya', 'Zoya', 'Akshit',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Kapoor', 'Singh', 'Rao',
  'Iyer', 'Nair', 'Reddy', 'Chopra', 'Malhotra', 'Bansal', 'Joshi',
  'Agarwal', 'Kulkarni', 'Bose', 'Menon', 'Pillai', 'Trivedi', 'Chaudhary', 'Patel', 'Khan', 'Jain', 'Saxena', 'Chatterjee', 'Ghosh',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function createColoredPng(hexColor: string): Buffer {
  const width = 96;
  const height = 96;
  const rgb = hexColor.replace('#', '');
  const r = parseInt(rgb.slice(0, 2), 16);
  const g = parseInt(rgb.slice(2, 4), 16);
  const b = parseInt(rgb.slice(4, 6), 16);

  const rawRows: Buffer[] = [];
  for (let y = 0; y < height; y++) {
    rawRows.push(Buffer.from([0]));
    for (let x = 0; x < width; x++) {
      rawRows.push(Buffer.from([r, g, b, 255]));
    }
  }

  const imageData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(imageData);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    createPngChunk('IHDR', ihdr),
    createPngChunk('IDAT', compressed),
    createPngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/** ~8-digit unique-ish suffix based on timestamp + random digits */
function uniqueSuffix(): string {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(10 + Math.random() * 89); // 2 digit
  return `${ts}${rand}`;
}

export class DataGenerator {
  /** Meaningful real-sounding first name (picked from a curated pool) */
  static firstName(): string {
    return pick(FIRST_NAMES);
  }

  static lastName(): string {
    return pick(LAST_NAMES);
  }

  /** Unique email, e.g. aarav.48291345@testmail.com */
  static email(firstName?: string): string {
    const name = (firstName ?? this.firstName()).toLowerCase();
    return `${name}.${uniqueSuffix()}@testmail.com`;
  }

  /** Unique 10-digit Indian mobile number, always starts with 6-9 */
  static phoneNumber(): string {
    const firstDigit = pick(['6', '7', '8', '9']);
    const rest = uniqueSuffix().padEnd(9, '0').slice(0, 9);
    return `${firstDigit}${rest}`;
  }

  /** Unique 12-digit document number (e.g. Aadhaar-like) */
  static documentNumber(): string {
    const firstDigit = Math.floor(2 + Math.random() * 8).toString();
    const remainingDigits = `${uniqueSuffix()}${Math.floor(1000 + Math.random() * 8999)}`;
    return `${firstDigit}${remainingDigits}`.slice(0, 12);
  }

  /** Teacher DOB should look realistic for a working professional. */
  static teacherDobYearForAge(minAge = 25, maxAge = 60): number {
    const currentYear = new Date().getFullYear();
    const age = Math.floor(minAge + Math.random() * (maxAge - minAge + 1));
    return currentYear - age;
  }

  /** Generates a valid-looking Indian IFSC code. */
  static ifscCode(): string {
    const banks = ['ABCD', 'AXIS', 'HDFC', 'ICIC', 'IDIB', 'INDB', 'KKBK', 'ORBC', 'PNBA', 'SBIN', 'UTIB', 'YESB'];
    const bankPrefix = pick(banks);
    const numericPart = `${Math.floor(100000 + Math.random() * 900000)}`;
    return `${bankPrefix}${numericPart}`.slice(0, 11);
  }

  /** Auto-detect bank name from IFSC when possible; otherwise return a sensible fallback. */
  static bankNameFromIfsc(ifsc: string): string {
    const bankMap: Record<string, string> = {
      SBIN: 'State Bank of India',
      HDFC: 'HDFC Bank',
      ICIC: 'ICICI Bank',
      AXIS: 'Axis Bank',
      YESB: 'Yes Bank',
      IDIB: 'IDBI Bank',
      KKBK: 'Kotak Mahindra Bank',
      ORBC: 'Bank of Baroda',
      UTIB: 'Axis Bank',
      INDB: 'Indian Bank',
      PNBA: 'Punjab National Bank',
      ABCD: 'Bank of India',
    };
    const prefix = (ifsc || '').slice(0, 4).toUpperCase();
    return bankMap[prefix] || 'Manual Bank Entry';
  }

  /** Random class between 5 and 10 (as required) */
  static randomClass(): string {
    return pick(['5', '6', '7', '8', '9', '10']);
  }

  /** Student DOB should look suitable for the class being entered. */
  static studentDobYearForClass(className: string): number {
    const year = new Date().getFullYear();
    const ageByClass: Record<string, number> = {
      '5': 10,
      '6': 11,
      '7': 12,
      '8': 13,
      '9': 14,
      '10': 15,
    };
    return year - (ageByClass[className] ?? 12);
  }

  /** Guardian DOB should be roughly 7 years older than the student, but never younger than 18. */
  static guardianDobYearForStudent(studentDobYear: number): number {
    const preferredYear = studentDobYear - 7;
    const minimumValidYear = new Date().getFullYear() - 18;
    return Math.min(preferredYear, minimumValidYear);
  }

  /** Generates a fresh PNG image file for each student/guardian upload. */
  static profileImage(label?: string): string {
    return this.generateImageFile('student', label);
  }

  static documentImage(label?: string): string {
    return this.generateImageFile('document', label);
  }

  /** Unique school name */
  static schoolName(): string {
    const schoolPrefixes = [
      'Green Valley', 'Delhi Public', 'St. Xavier', 'Mount Carmel',
      'Modern Public', 'Bloomfield', 'Apex International', 'Heritage Public',
      'Oakridge', 'Silver Oak', 'Wisdom World', 'Sunrise Global',
    ];
    return `${pick(schoolPrefixes)} School ${uniqueSuffix()}`;
  }

  /** Short, authentic real-world PTM title with a short unique suffix */
  static ptmTitle(): string {
    const realPtmNames = [
      'Term 1 PTM',
      'Mid-Term PTM',
      'Annual PTM',
      'Quarterly PTM',
      'Unit Test PTM',
      'Semester 1 PTM',
      'Pre-Board PTM',
    ];
    const shortCode = Math.floor(100 + Math.random() * 900);
    return `${pick(realPtmNames)} #${shortCode}`;
  }

  /** Short, meaningful description for PTM meeting */
  static ptmDescription(title?: string): string {
    return `Discussion of student academic progress, attendance, and feedback for ${title || 'this session'}.`;
  }

  /** Realistic authentic school notice titles with unique short code */
  static noticeTitle(): string {
    const realNotices = [
      'School Holiday Announcement',
      'Annual Sports Meet Schedule',
      'Mid-Term Examination Guidelines',
      'Science Exhibition & Project Submission',
      'Winter Vacation Advisory',
      'Parent Orientation Programme',
      'Fee Submission & Installment Notice',
      'Inter-School Cultural Fest Circular',
    ];
    const shortCode = Math.floor(100 + Math.random() * 900);
    return `${pick(realNotices)} #${shortCode}`;
  }

  /** Long, detailed notice description satisfying the 'description should be greater' requirement */
  static detailedNoticeDescription(title?: string): string {
    const subject = title || 'the upcoming school session';
    return (
      `Dear Students, Parents, and Guardians,\n\n` +
      `This is an official communication regarding ${subject}. All students are requested to strictly adhere to the scheduled timings, institutional guidelines, and academic regulations. ` +
      `Class teachers and section coordinators will provide additional orientation in the homeroom period. ` +
      `Please ensure all necessary preparations, documentation, and submissions are completed in advance without delay.\n\n` +
      `Parents are cordially invited to review the notice details and reach out to the administrative desk for any queries, special accommodations, or assistance during office hours (08:30 AM to 02:00 PM).\n\n` +
      `Thank you for your continued cooperation and partnership in ensuring academic excellence.`
    );
  }

  /** Realistic authentic school event names with a unique short code to prevent duplicacy */
  static eventTitle(): string {
    const realEvents = [
      'Annual Sports Meet',
      'Inter-House Cultural Fest',
      'Science & Robotics Exhibition',
      'Independence Day Celebration',
      'Literary & Debate Championship',
      'Annual Day Function',
      'Art & Craft Carnival',
      'Math Olympiad Felicitation',
    ];
    const shortCode = Math.floor(100 + Math.random() * 900);
    return `${pick(realEvents)} #${shortCode}`;
  }

  /** Detailed description for school events */
  static eventDescription(title?: string): string {
    const eventName = title || 'the scheduled school event';
    return `Annual school gathering for ${eventName}. All participants and attendees are requested to be present at the venue on time. Guidelines and program schedule will be circulated by event coordinators.`;
  }

  /** Realistic venue / location for events */
  static eventVenue(): string {
    const venues = [
      'Main School Auditorium',
      'Central Sports Complex',
      'Open Air Amphitheatre',
      'Junior School Hall',
      'School Football Ground',
    ];
    return pick(venues);
  }

  /**
   * Generates unique dates in next month in incremental order:
   * - Start Day: e.g. 8th of next month
   * - End Day: e.g. 16th of next month (strictly in increment order)
   */
  static nextMonthEventDates(): { startDay: number; endDay: number } {
    const startDay = Math.floor(5 + Math.random() * 8); // 5 to 12
    const endDay = startDay + Math.floor(4 + Math.random() * 8); // 9 to 20
    return { startDay, endDay };
  }

  /** Generates a fresh valid JPEG image file */
  static randomJpgImage(label = 'school-logo'): string {
    const generatedDir = path.join(process.cwd(), 'testdata', 'generated');
    fs.mkdirSync(generatedDir, { recursive: true });

    const safeName = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'image';

    const filePath = path.join(generatedDir, `${safeName}-${Date.now()}-${uniqueSuffix()}.jpg`);

    // Minimal valid 1x1 baseline JPEG binary
    const minimalJpg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
      0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
      0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
      0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
      0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
      0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
      0x00, 0xbf, 0x00, 0xff, 0xd9,
    ]);

    fs.writeFileSync(filePath, minimalJpg);
    return filePath;
  }


  private static generateImageFile(prefix: string, label?: string): string {
    const generatedDir = path.join(process.cwd(), 'testdata', 'generated');
    fs.mkdirSync(generatedDir, { recursive: true });

    const safeName = (label ?? prefix)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'image';

    const hue = Math.floor(Math.random() * 360);
    const hex = `hsl(${hue}, 72%, 56%)`;
    const rgb = this.hslToHex(hue, 72, 56);
    const filePath = path.join(generatedDir, `${prefix}-${safeName}-${Date.now()}-${uniqueSuffix()}.png`);
    fs.writeFileSync(filePath, createColoredPng(rgb));
    return filePath;
  }

  private static hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    const toHex = (value: number) => Math.round((value + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  static randomEmployeeRole(): string {
    const roles = [
      'Admin',
      'Principal',
      'Vice-Principal',
      'Teaching-Assistant',
      'Head-Teacher',
      'Sports-Coach',
      'Special-Education-Teacher',
      'Registrar',
      'Athletic-Director',
      'Academic Coach',
      'Academic Dean',
      'Career Counselor',
      'Curriculum Coordinator',
      'Educational Specialist',
      'Foreign Language Teacher',
      'Instructional Designer',
      'Math Specialist',
      'Reading Specialist',
      'Research and Development Specialist',
      'School Counselor',
      'School Librarian',
      'School Psychologist',
      'Special Education Specialist',
      'Speech-Language Pathologist',
      'Sport Coach',
      'Teacher Aide',
      'Testing and Assessment Coordinator',
      'Guidance Counselor',
      'Receptionist',
      'Budget Analyst',
      'Administrative Assistant',
      'Bus Driver',
      'Cafeteria Worker',
      'Community Outreach Coordinator',
      'Custodian',
      'Data Entry Clerk',
      'Health Aide',
      'IT Technician',
      'Janitor',
      'Kitchen Staff',
      'Librarian',
      'Library Assistant',
      'Maintenance Worker',
      "Principal's Secretary",
      'Public Relations Coordinator',
      'Record Clerk',
      'School Nurse',
      'School Resource Officer',
      'Security Guard',
      'Social Worker',
      'Technology Support Specialist',
      'Transportation Coordinator',
      'Accountant',
      'Psychologist',
      'Conductor',
      'Helper',
      'Hostel Warden',
      'Transport Incharge',
      'Admission Counselor',
      'Front Office Executive',
      'Store Keeper',
      'Office Superintendent',
      'Peon / Office Boy',
      'Sweeper',
      'Electrician',
      'Plumber',
      'Groundskeeper',
      'CCTV Operator',
      'Lab Assistant',
      'HR',
      'Finance',
      'Parent',
      'PT'
    ];

    return pick(roles);
  }
}