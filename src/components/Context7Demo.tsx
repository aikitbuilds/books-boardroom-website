import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BookOpen, Code, Search, Zap, CheckCircle, AlertCircle, 
  Loader2, FileText, Globe, Database, Cpu
} from 'lucide-react';
import { mcpClient } from '@/lib/mcp-client';

interface LibraryDoc {
  library: string;
  topic?: string;
  content: string;
  timestamp: string;
  source: 'context7' | 'mock';
}

export default function Context7Demo() {
  const [selectedLibrary, setSelectedLibrary] = useState('react');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [documentation, setDocumentation] = useState<LibraryDoc | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContext7Available, setIsContext7Available] = useState(false);

  const popularLibraries = [
    { name: 'react', icon: '⚛️', description: 'JavaScript library for building user interfaces' },
    { name: 'firebase', icon: '🔥', description: 'Platform for building web and mobile applications' },
    { name: 'nextjs', icon: '▲', description: 'React framework for production' },
    { name: 'typescript', icon: '📘', description: 'Typed superset of JavaScript' },
    { name: 'vite', icon: '⚡', description: 'Next generation frontend tooling' },
    { name: 'tailwindcss', icon: '🎨', description: 'Utility-first CSS framework' }
  ];

  const commonTopics = [
    'hooks', 'routing', 'authentication', 'api', 'components', 
    'state management', 'testing', 'deployment', 'configuration'
  ];

  useEffect(() => {
    checkContext7Availability();
  }, []);

  const checkContext7Availability = async () => {
    try {
      const healthCheck = await mcpClient.healthCheck();
      setIsContext7Available(!mcpClient.isUsingMockServer());
    } catch (error) {
      setIsContext7Available(false);
    }
  };

  const fetchDocumentation = async () => {
    if (!selectedLibrary) return;

    setIsLoading(true);
    setError(null);

    try {
      const content = await mcpClient.getLibraryDocumentation(selectedLibrary, selectedTopic || undefined);
      
      const doc: LibraryDoc = {
        library: selectedLibrary,
        topic: selectedTopic || undefined,
        content,
        timestamp: new Date().toISOString(),
        source: mcpClient.isUsingMockServer() ? 'mock' : 'context7'
      };

      setDocumentation(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documentation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLibrarySelect = (library: string) => {
    setSelectedLibrary(library);
    setSelectedTopic('');
    setDocumentation(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Context7 MCP Demo</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience real-time documentation fetching with Context7 MCP Server. 
          Get up-to-date, version-specific documentation for your favorite libraries.
        </p>
        
        {/* Status Badge */}
        <div className="flex items-center justify-center gap-2">
          {isContext7Available ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Context7 Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Using Mock Server
            </Badge>
          )}
        </div>
      </div>

      {/* Library Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Select Library
          </CardTitle>
          <CardDescription>
            Choose a library to fetch real-time documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularLibraries.map((lib) => (
              <Button
                key={lib.name}
                variant={selectedLibrary === lib.name ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => handleLibrarySelect(lib.name)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">{lib.icon}</span>
                  <span className="font-medium">{lib.name}</span>
                </div>
                <span className="text-xs text-left opacity-70">
                  {lib.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Selection */}
      {selectedLibrary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Specify Topic (Optional)
            </CardTitle>
            <CardDescription>
              Narrow down the documentation to a specific topic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Custom Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., hooks, routing, authentication..."
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Common Topics</Label>
              <div className="flex flex-wrap gap-2">
                {commonTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={fetchDocumentation}
              disabled={isLoading || !selectedLibrary}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching Documentation...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Fetch Documentation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Documentation Display */}
      {documentation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentation: {documentation.library}
                {documentation.topic && ` - ${documentation.topic}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={documentation.source === 'context7' ? 'default' : 'secondary'}>
                  {documentation.source === 'context7' ? (
                    <>
                      <Globe className="h-3 w-3 mr-1" />
                      Live
                    </>
                  ) : (
                    <>
                      <Database className="h-3 w-3 mr-1" />
                      Mock
                    </>
                  )}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(documentation.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {documentation.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Context7 Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Real-time Documentation
              </h4>
              <p className="text-sm text-gray-600">
                Fetches the latest documentation directly from official sources
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Version-specific Content
              </h4>
              <p className="text-sm text-gray-600">
                Ensures you get documentation for the exact library version
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Topic Filtering
              </h4>
              <p className="text-sm text-gray-600">
                Narrow down results to specific topics or features
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Automatic Fallback
              </h4>
              <p className="text-sm text-gray-600">
                Gracefully falls back to mock data when Context7 is unavailable
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 