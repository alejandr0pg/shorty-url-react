/**
 * URL Card component - Displays individual URL with actions
 */

import React, { useState } from 'react';
import { Card, Button, Input } from '../../../shared/components';
import { useCopyToClipboard } from '../../../shared/hooks';
import { Url } from '../../../shared/types';

interface UrlCardProps {
  url: Url;
  onUpdate?: (id: number, newUrl: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  className?: string;
}

const UrlCard: React.FC<UrlCardProps> = ({
  url,
  onUpdate,
  onDelete,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(url.original_url);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { copiedText, copy, reset: resetCopy } = useCopyToClipboard();
  const shortUrl = `${window.location.origin}/${url.short_code}`;
  const isThisUrlCopied = copiedText === shortUrl;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopy = async () => {
    const success = await copy(shortUrl);
    if (success) {
      setTimeout(resetCopy, 2000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(url.original_url);
  };

  const handleSave = async () => {
    if (!onUpdate || editValue.trim() === url.original_url) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(url.id, editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating URL:', error);
      // TODO: Show error toast
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(url.original_url);
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(url.id);
    } catch (error) {
      console.error('Error deleting URL:', error);
      // TODO: Show error toast
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Card className={className} padding="md" shadow="sm">
      <div className="space-y-4">
        {/* Original URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Original
          </label>
          {isEditing ? (
            <Input
              type="url"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={isUpdating}
              autoFocus
            />
          ) : (
            <a
              href={url.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-900 hover:text-blue-600 transition-colors break-all"
              title={url.original_url}
            >
              {url.original_url}
            </a>
          )}
        </div>

        {/* Short URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Corta
          </label>
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-blue-600 hover:text-blue-700 font-medium break-all"
            >
              {shortUrl}
            </a>
            <Button
              onClick={handleCopy}
              variant={isThisUrlCopied ? 'success' : 'ghost'}
              size="sm"
              icon={
                isThisUrlCopied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              }
              title="Copiar URL"
            >
              {isThisUrlCopied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {url.clicks} clics
            </span>
            <span>{formatDate(url.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                variant="primary"
                size="sm"
                loading={isUpdating}
                disabled={!editValue.trim() || editValue.trim() === url.original_url}
              >
                Guardar
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                disabled={isUpdating}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              {onUpdate && (
                <Button
                  onClick={handleEdit}
                  variant="ghost"
                  size="sm"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  }
                  title="Editar URL"
                >
                  Editar
                </Button>
              )}
            </div>
          )}

          {onDelete && !isEditing && (
            <div>
              {showDeleteConfirm ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    size="sm"
                    loading={isDeleting}
                  >
                    Confirmar
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                  size="sm"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                  title="Eliminar URL"
                >
                  Eliminar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UrlCard;