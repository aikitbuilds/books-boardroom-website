import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Search, 
  Calendar, 
  Tag,
  ExternalLink,
  ChevronRight,
  Book,
  Code,
  GitBranch,
  Settings
} from 'lucide-react';
import { DocumentationFile } from '../types';

interface DocumentationViewerProps {
  documentation: DocumentationFile[];
  searchQuery: string;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ 
  documentation, 
  searchQuery 
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const typeIcons = {
    readme: <Book className="w-4 h-4" />,
    changelog: <GitBranch className="w-4 h-4" />,
    api: <Code className="w-4 h-4" />,
    guide: <FileText className="w-4 h-4" />,
    other: <Settings className="w-4 h-4" />
  };

  const typeColors = {
    readme: 'bg-blue-100 text-blue-800',
    changelog: 'bg-green-100 text-green-800',
    api: 'bg-purple-100 text-purple-800',
    guide: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  // Filter and search documentation
  const filteredDocs = useMemo(() => {
    let filtered = documentation;
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }
    
    // Search in name and content
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => {
      // Sort by type priority, then by name
      const typePriority = { readme: 1, guide: 2, api: 3, changelog: 4, other: 5 };
      const aPriority = typePriority[a.type] || 5;
      const bPriority = typePriority[b.type] || 5;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return a.name.localeCompare(b.name);
    });
  }, [documentation, searchQuery, selectedType]);

  const selectedDocument = selectedDoc ? documentation.find(doc => doc.path === selectedDoc) : null;
  const uniqueTypes = [...new Set(documentation.map(doc => doc.type))];

  // Extract headings from markdown content for table of contents
  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Array<{ level: number; text: string; id: string }> = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ level, text, id });
    }
    
    return headings;
  };

  const headings = selectedDocument ? extractHeadings(selectedDocument.content) : [];

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Filter controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredDocs.length} of {documentation.length} documents
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>
        </div>
        
        {/* Document list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredDocs.map((doc) => (
              <button
                key={doc.path}
                onClick={() => setSelectedDoc(doc.path)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  selectedDoc === doc.path
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    typeColors[doc.type]
                  }`}>
                    {typeIcons[doc.type]}
                    {doc.type}
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mt-2 mb-1">
                  {doc.name}
                </h3>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {doc.lastModified.toLocaleDateString()}
                  </div>
                  
                  <div>
                    {Math.round(doc.content.length / 100)} lines
                  </div>
                </div>
                
                {searchQuery && doc.content.toLowerCase().includes(searchQuery.toLowerCase()) && (
                  <div className="mt-2 text-xs text-blue-600">
                    Contains search term
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {filteredDocs.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                {searchQuery ? 'No documents match your search' : 'No documents found'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex">
        {selectedDocument ? (
          <>
            {/* Document content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                {/* Document header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
                      typeColors[selectedDocument.type]
                    }`}>
                      {typeIcons[selectedDocument.type]}
                      {selectedDocument.type}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Last updated {selectedDocument.lastModified.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedDocument.name}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {selectedDocument.path}
                    </code>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Markdown content */}
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="px-1 py-0.5 bg-gray-100 text-gray-800 rounded text-sm">
                            {children}
                          </code>
                        ) : (
                          <div className="my-4">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{children}</code>
                            </pre>
                          </div>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 my-4">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-4">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700">{children}</li>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed my-3">
                          {children}
                        </p>
                      ),
                      a: ({ children, href }) => (
                        <a 
                          href={href} 
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      )
                    }}
                  >
                    {selectedDocument.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            
            {/* Table of contents */}
            {headings.length > 0 && (
              <div className="w-64 border-l border-gray-200 bg-gray-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Table of Contents
                  </h3>
                  
                  <nav className="space-y-1">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors ${
                          heading.level === 1 ? 'font-medium' :
                          heading.level === 2 ? 'pl-2' :
                          heading.level === 3 ? 'pl-4' :
                          'pl-6'
                        }`}
                        style={{ 
                          paddingLeft: `${(heading.level - 1) * 12}px`,
                          fontSize: heading.level === 1 ? '14px' : '13px'
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 opacity-50" />
                          {heading.text}
                        </div>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No document selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a document to view
              </h3>
              <p className="text-gray-600">
                Choose a document from the sidebar to read its content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationViewer;