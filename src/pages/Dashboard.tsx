import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Users, FileText, ArrowUp, ArrowDown, Trash2, Eye } from 'lucide-react';
import Button from '../components/Button';
import { supabase } from '../lib/supabaseClient';
import { getUserDocuments, getUserCredits } from '../lib/api';
import type { Document, UserCredits } from '../lib/types';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const [userDocs, userCredits] = await Promise.all([
            getUserDocuments(session.user.id),
            getUserCredits(session.user.id)
          ]);
          setDocuments(userDocs);
          setCredits(userCredits);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(docs => docs.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  return (
    <div className="animate-fadeIn bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Documents Created</h3>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">12%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="flex items-center text-sm text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                Available
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Credits Remaining</h3>
            <p className="text-2xl font-bold text-gray-900">
              {credits?.credits_remaining || 0}
            </p>
            <div className="mt-2 flex items-center text-sm">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">8%</span>
              <span className="text-gray-500 ml-2">usage rate</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <span className="flex items-center text-sm text-blue-600">Total</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Credits Used</h3>
            <p className="text-2xl font-bold text-gray-900">
              {credits?.credits_used || 0}
            </p>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">24%</span>
              <span className="text-gray-500 ml-2">efficiency</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <PieChart className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Success Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {documents.length > 0
                ? Math.round((documents.filter(d => d.status === 'completed').length / documents.length) * 100)
                : 0}%
            </p>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">5%</span>
              <span className="text-gray-500 ml-2">improvement</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'error' ? 'primary' : 'outline'}
              onClick={() => setFilter('error')}
            >
              Failed
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'grid' ? 'primary' : 'outline'}
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => setView('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Documents Grid/List */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all'
                  ? "You haven't created any documents yet. Start by creating one in the Rewriter."
                  : `No ${filter} documents found. Try a different filter.`}
              </p>
              <Button variant="primary" onClick={() => setFilter('all')}>
                Show all documents
              </Button>
            </div>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate" title={doc.title}>
                      {doc.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Words: {doc.words_count}</span>
                      <span className="mx-2">•</span>
                      <span>Credits: {doc.credits_used}</span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : doc.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Words: {doc.words_count}</span>
                        <span>Credits: {doc.credits_used}</span>
                        <span>Status: {doc.status}</span>
                        <span>
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDocument.title}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDocument(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {selectedDocument.original_text}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Humanized Text</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {selectedDocument.humanized_text || 'Processing...'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Word Count:</span>
                      <span className="ml-2 text-gray-900">{selectedDocument.words_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Credits Used:</span>
                      <span className="ml-2 text-gray-900">{selectedDocument.credits_used}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedDocument.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;