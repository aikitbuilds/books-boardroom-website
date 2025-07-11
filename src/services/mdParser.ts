/**
 * Markdown Parser Service
 * Utility functions for parsing markdown files and extracting structured content
 * for the SPS-OSX Dashboard
 */

import { marked } from 'marked';
import mermaid from 'mermaid';

// Use type instead of interface for extending Marked types
type HeadingToken = {
  type: 'heading';
  depth: number;
  text: string;
  raw: string;
};

type ParagraphToken = {
  type: 'paragraph';
  text: string;
  raw: string;
};

type ListItemToken = {
  type: 'list_item';
  text: string;
  raw: string;
  tokens?: any[];
};

type ListToken = {
  type: 'list';
  items: ListItemToken[];
  raw: string;
};

/**
 * Parse project brief from the projectBrief.md file
 * @param content - Raw markdown content
 * @returns Object containing parsed project brief information
 */
export const parseProjectBrief = (content: string) => {
  const tokens = marked.lexer(content);
  const sections: Record<string, string> = {};
  let currentSection = 'overview';
  let sectionContent = '';
  
  tokens.forEach(token => {
    if (token.type === 'heading') {
      if (currentSection !== 'overview') {
        sections[currentSection] = sectionContent.trim();
      }
      currentSection = (token as HeadingToken).text.toLowerCase().replace(/\s+/g, '_');
      sectionContent = '';
    } else if (token.type === 'paragraph' || token.type === 'list') {
      sectionContent += (token as ParagraphToken).text + '\n\n';
    }
  });
  
  // Add the last section
  if (currentSection) {
    sections[currentSection] = sectionContent.trim();
  }
  
  return sections;
};

/**
 * Parse planning board from the planning_board.md file
 * @param content - Raw markdown content
 * @returns Object containing parsed planning board information
 */
export const parsePlanningBoard = (content: string) => {
  const tokens = marked.lexer(content);
  const sections: Record<string, any> = {
    part1: { title: 'Identification & Discovery', content: '' },
    part2: { title: 'Execution Plan', content: '' },
    part3: { title: 'Optimization & Testing', content: '' },
    milestones: []
  };
  
  let currentPart = '';
  let currentSection = '';
  let overallCompletion = 0;
  
  tokens.forEach(token => {
    if (token.type === 'heading') {
      const headingToken = token as HeadingToken;
      
      if (headingToken.depth === 1 && headingToken.text.toLowerCase().includes('part')) {
        if (headingToken.text.toLowerCase().includes('part 1')) {
          currentPart = 'part1';
        } else if (headingToken.text.toLowerCase().includes('part 2')) {
          currentPart = 'part2';
        } else if (headingToken.text.toLowerCase().includes('part 3')) {
          currentPart = 'part3';
        }
      } else if (headingToken.text.toLowerCase().includes('milestone')) {
        // Extract milestone number and name
        const match = headingToken.text.match(/milestone\s*(\d+):\s*(.*)/i);
        if (match) {
          const milestoneNumber = parseInt(match[1], 10);
          const milestoneName = match[2].trim();
          
          // Look ahead for completion percentage
          const milestoneCompletion = findCompletionPercentage(tokens, tokens.indexOf(token));
          
          sections.milestones.push({
            id: milestoneNumber,
            name: milestoneName,
            status: milestoneCompletion > 0 ? (milestoneCompletion === 100 ? 'Completed' : 'In Progress') : 'Not Started',
            completion: milestoneCompletion,
            tasks: [],
            tasksCompleted: 0
          });
        }
      } else if (headingToken.text.toLowerCase().includes('progress')) {
        const match = headingToken.text.match(/progress:\s*(\d+)%/i);
        if (match) {
          overallCompletion = parseInt(match[1], 10);
        }
      }
    }
  });
  
  sections.overallCompletion = overallCompletion;
  
  return sections;
};

/**
 * Parse workflow information from the workflow.md file
 * @param content - Raw markdown content
 * @returns Object containing parsed workflow information and Mermaid diagrams
 */
export const parseWorkflow = (content: string) => {
  const tokens = marked.lexer(content);
  const sections: Record<string, any> = {
    overview: '',
    diagrams: []
  };
  
  let inCodeBlock = false;
  let currentDiagram = '';
  
  tokens.forEach(token => {
    if (token.type === 'code' && token.lang === 'mermaid') {
      sections.diagrams.push(token.text);
    } else if (token.type === 'paragraph' && !inCodeBlock) {
      sections.overview += token.text + '\n\n';
    }
  });
  
  return sections;
};

/**
 * Parse progress information from the progress.md file
 * @param content - Raw markdown content
 * @returns Object containing parsed progress information
 */
export const parseProgress = (content: string) => {
  const tokens = marked.lexer(content);
  const progress = {
    current: '',
    lastUpdated: '',
    history: []
  };
  
  let currentSection = '';
  
  tokens.forEach(token => {
    if (token.type === 'heading') {
      const headingToken = token as HeadingToken;
      if (headingToken.text.toLowerCase().includes('current status')) {
        currentSection = 'current';
      } else if (headingToken.text.toLowerCase().includes('update history')) {
        currentSection = 'history';
      } else if (headingToken.text.match(/\d{4}-\d{2}-\d{2}/)) {
        // Found a date heading in history
        const date = headingToken.text;
        progress.lastUpdated = progress.lastUpdated || date;
        
        // Look ahead for content
        const nextToken = tokens[tokens.indexOf(token) + 1];
        if (nextToken && nextToken.type === 'paragraph') {
          progress.history.push({
            date,
            content: (nextToken as ParagraphToken).text
          });
        }
      }
    } else if (token.type === 'paragraph' && currentSection === 'current') {
      progress.current += (token as ParagraphToken).text + '\n\n';
    }
  });
  
  return progress;
};

/**
 * Parse rules from the rules.md file
 * @param content - Raw markdown content
 * @returns Object containing parsed rules
 */
export const parseRules = (content: string) => {
  const tokens = marked.lexer(content);
  const rules: any[] = [];
  
  let currentRule: any = null;
  let inRuleSection = false;
  let inKeySteps = false;
  
  tokens.forEach(token => {
    if (token.type === 'heading') {
      const headingToken = token as HeadingToken;
      
      // Check for rule header (e.g., "## 1. Project Definition & Planning")
      const ruleMatch = headingToken.text.match(/^(\d+)\.\s*(.*)/);
      
      if (ruleMatch && headingToken.depth === 2) {
        // Save previous rule if exists
        if (currentRule) {
          rules.push(currentRule);
        }
        
        // Create new rule
        currentRule = {
          id: parseInt(ruleMatch[1], 10),
          name: ruleMatch[2].trim(),
          description: '',
          steps: []
        };
        
        inRuleSection = true;
        inKeySteps = false;
      } else if (headingToken.text.toLowerCase().includes('key steps') && inRuleSection) {
        inKeySteps = true;
      }
    } else if (token.type === 'paragraph' && inRuleSection && !inKeySteps && currentRule) {
      currentRule.description += (token as ParagraphToken).text + '\n';
    } else if (token.type === 'list' && inKeySteps && currentRule) {
      const listToken = token as ListToken;
      listToken.items.forEach(item => {
        if (item.text) {
          currentRule.steps.push(item.text.replace(/^-\s*/, ''));
        }
      });
    }
  });
  
  // Add the last rule
  if (currentRule) {
    rules.push(currentRule);
  }
  
  return { rules };
};

/**
 * Parse all markdown files for the dashboard
 * @param files - Object containing content of all markdown files
 * @returns Object containing parsed data from all markdown files
 */
export const parseAllMdFiles = (files: Record<string, string>) => {
  const result: Record<string, any> = {};
  
  if (files.projectBrief) {
    result.projectBrief = parseProjectBrief(files.projectBrief);
  }
  
  if (files.planningBoard) {
    result.planningBoard = parsePlanningBoard(files.planningBoard);
  }
  
  if (files.workflow) {
    result.workflow = parseWorkflow(files.workflow);
  }
  
  if (files.progress) {
    result.progress = parseProgress(files.progress);
  }
  
  if (files.rules) {
    result.rules = parseRules(files.rules);
  }
  
  return result;
};

/**
 * Convert Mermaid diagram text to SVG
 * @param diagram - Mermaid diagram text
 * @returns Promise resolving to SVG string
 */
export const mermaidToSvg = async (diagram: string): Promise<string> => {
  try {
    // Initialize mermaid (it's safe to call initialize multiple times)
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
    });
    
    // Generate SVG
    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, diagram);
    return svg;
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    return `<div class="p-4 border border-red-300 bg-red-50 text-red-800 rounded">
              <p>Error rendering diagram</p>
              <pre class="mt-2 text-xs">${diagram}</pre>
            </div>`;
  }
};

/**
 * Helper function to find completion percentage in tokens
 * @param tokens - Array of markdown tokens
 * @param startIndex - Index to start searching from
 * @returns Completion percentage
 */
const findCompletionPercentage = (tokens: any[], startIndex: number): number => {
  for (let i = startIndex + 1; i < tokens.length && i < startIndex + 5; i++) {
    const token = tokens[i];
    if (token.type === 'paragraph') {
      const match = token.text.match(/completion:\s*(\d+)%/i);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
  }
  return 0;
}; 