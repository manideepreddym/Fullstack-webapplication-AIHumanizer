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
              <span className="text-sm text-gray-500">
                Last 30 days
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Documents Created</h3>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
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
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <span className="flex items-center text-sm text-blue-600">
                Total
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Credits Used</h3>
            <p className="text-2xl font-bold text-gray-900">
              {credits?.credits_used || 0}
            </p>
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
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
          </div>
          
          {documents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No documents yet. Start by creating one in the Rewriter.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
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
          )}
        </div>

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDocument.title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Original Text</h4>
                    <p className="mt-1 text-gray-600 bg-gray-50 p-4 rounded">
                      {selectedDocument.original_text}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Humanized Text</h4>
                    <p className="mt-1 text-gray-600 bg-gray-50 p-4 rounded">
                      {selectedDocument.humanized_text || 'Processing...'}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDocument(null)}
                  >
                    Close
                  </Button>
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