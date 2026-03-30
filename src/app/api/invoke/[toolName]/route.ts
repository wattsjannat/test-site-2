import { NextRequest, NextResponse } from 'next/server';

// Mock MCP tool responses
const mockResponses: Record<string, any> = {
  'linkedin-profile': {
    success: true,
    data: {
      name: 'Demo User',
      title: 'Software Engineer',
      experience: [
        {
          company: 'Tech Corp',
          title: 'Senior Developer',
          duration: '2 years',
        },
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    },
  },
  'job-search': {
    success: true,
    data: {
      jobs: [
        {
          id: '1',
          title: 'Senior Developer',
          company: 'Tech Corp',
          location: 'Riyadh',
          salaryRange: '15,000 - 20,000 SAR',
          matchScore: 85,
          fitCategory: 'excellent',
        },
        {
          id: '2',
          title: 'Full Stack Engineer',
          company: 'Innovation Labs',
          location: 'Jeddah',
          salaryRange: '18,000 - 23,000 SAR',
          matchScore: 78,
          fitCategory: 'good',
        },
      ],
    },
  },
  'career-growth': {
    success: true,
    data: {
      currentLevel: 'Mid-level',
      targetLevel: 'Senior',
      progress: 65,
      skillsGap: ['System Design', 'Leadership', 'Architecture'],
    },
  },
  'learning-path': {
    success: true,
    data: {
      courses: [
        {
          id: '1',
          title: 'Advanced React Patterns',
          provider: 'Coursera',
          duration: '4 weeks',
          relevance: 'high',
        },
        {
          id: '2',
          title: 'System Design Fundamentals',
          provider: 'Udemy',
          duration: '6 weeks',
          relevance: 'high',
        },
      ],
    },
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ toolName: string }> }
) {
  try {
    const { toolName } = await params;
    const body = await request.json();

    console.log(`[API] MCP tool invoked: ${toolName}`, body);

    // Return mock response if available
    const mockResponse = mockResponses[toolName];
    if (mockResponse) {
      return NextResponse.json(mockResponse);
    }

    // Default success response for unknown tools
    return NextResponse.json({
      success: true,
      data: { message: `Tool ${toolName} executed successfully` },
    });
  } catch (error) {
    console.error('[API] MCP tool error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
