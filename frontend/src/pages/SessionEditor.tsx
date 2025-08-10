import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSessionById, saveDraft, publishSession, uploadSessionImage, Session } from '../services/sessionServices';
import { debounce } from 'lodash';
import { Globe, Loader2, Cloud, CheckCircle2, AlertTriangle, ArrowLeft, ImageUp } from 'lucide-react';
import toast from 'react-hot-toast';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'failed';

const SessionEditor: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string | undefined>(paramId);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(!!paramId);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');

  useEffect(() => {
    if (paramId) {
      const fetchSession = async () => {
        setIsLoading(true);
        try {
          const response = await getSessionById(paramId);
          const { title, tags, json_file_url, coverImageUrl } = response.data;
          setTitle(title);
          setTags(tags.join(', '));
          setJsonFileUrl(json_file_url || '');
          setCoverImageUrl(coverImageUrl || '');
          setImagePreview(coverImageUrl || null);
        } catch (error) {
          toast.error('Could not load session.');
          navigate('/my-sessions');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSession();
    }
  }, [paramId, navigate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true);
      try {
        const response = await uploadSessionImage(file);
        setCoverImageUrl(response.data.imageUrl);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Image upload failed.');
        setImagePreview(coverImageUrl);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const debouncedSave = useCallback(
    debounce(async (data: { title: string; tags: string; jsonFileUrl: string; coverImageUrl: string; currentId?: string }) => {
      setAutoSaveStatus('saving');
      try {
        const sessionData = {
          _id: data.currentId,
          title: data.title.trim(),
          tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          json_file_url: data.jsonFileUrl.trim(),
          coverImageUrl: data.coverImageUrl,
        };
        const response = await saveDraft(sessionData);

        if (!data.currentId && response.data._id) {
          setSessionId(response.data._id);
          navigate(`/editor/${response.data._id}`, { replace: true });
        }

        setAutoSaveStatus('saved');
      } catch {
        setAutoSaveStatus('failed');
      }
    }, 2000),
    [navigate]
  );

  useEffect(() => {
    if (title.trim() || tags.trim() || jsonFileUrl.trim() || coverImageUrl.trim()) {
      debouncedSave({ title, tags, jsonFileUrl, coverImageUrl, currentId: sessionId });
    }
    return () => debouncedSave.cancel();
  }, [title, tags, jsonFileUrl, coverImageUrl, sessionId, debouncedSave]);

  useEffect(() => {
    if (autoSaveStatus === 'saved' || autoSaveStatus === 'failed') {
      const timer = setTimeout(() => setAutoSaveStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [autoSaveStatus]);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('A title is required to publish.');
      return;
    }

    debouncedSave.cancel();
    setIsPublishing(true);

    try {
      const sessionData = {
        _id: sessionId,
        title: title.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        json_file_url: jsonFileUrl.trim(),
        coverImageUrl: coverImageUrl.trim(),
      };
      await publishSession(sessionData);
      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (error) {
      toast.error('Failed to publish session.');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <><Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-500" />Saving...</>;
      case 'saved':
        return <><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />Saved</>;
      case 'failed':
        return <><AlertTriangle className="w-5 h-5 mr-2 text-red-500" />Save failed</>;
      default:
        return <><Cloud className="w-5 h-5 mr-2 text-gray-400" />Draft</>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/my-sessions" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Sessions
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Editor</h1>
          <p className="text-gray-600">
            {paramId ? 'Edit your wellness session' : 'Create a new wellness session'}
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-500 transition-opacity duration-300">
          {renderAutoSaveIcon()}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div className="space-y-6">

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Session preview" className="mx-auto h-48 w-auto rounded-md object-cover" />
                ) : (
                  <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                    <span>{isUploading ? 'Uploading...' : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isUploading} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter session title"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="meditation, mindfulness, relaxation"
            />
          </div>

          {/* JSON File URL */}
          <div>
            <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700 mb-2">JSON File URL</label>
            <input
              type="url"
              id="json_file_url"
              value={jsonFileUrl}
              onChange={(e) => setJsonFileUrl(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://example.com/session.json"
            />
          </div>

          <div className="flex items-center justify-end pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button onClick={handlePublish} disabled={isPublishing || !title.trim()} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
