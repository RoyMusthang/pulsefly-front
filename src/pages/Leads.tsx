import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useCallback } from "react";
import Header from "@/components/header";
import type React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadIcon, FileIcon, CheckCircleIcon } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import axios from "axios";
import { Label } from "@/components/ui/label";

const CHUNK_SIZE = 1024 * 1024 * 0.001; // 0.5MB chunks

export default function Leads() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [tag, setTag] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        navigate("/login")
        return;
      }
    };
    validateToken();
  }, [navigate]);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const chunkText = (text: string, chunkSize: number): string[] => {
    const lines = text.split('\n');
    const chunks: string[] = [];
    let currentChunk = '';
    let currentChunkSize = 0;

    for (const line of lines) {
      const lineSize = new Blob([line]).size;
      if (currentChunkSize + lineSize > chunkSize) {
        chunks.push(currentChunk);
        currentChunk = '';
        currentChunkSize = 0;
      }
      currentChunk += `${line}\n`;
      currentChunkSize += lineSize;
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  const uploadChunk = useCallback(async (chunk: string, chunkIndex: number, totalChunks: number) => {
    const formData = new FormData();
    formData.append('file', new Blob([chunk], { type: 'text/csv' }), `chunk-${chunkIndex}`);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
console.log("tga", tag)
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/lead/${tag}`, formData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('access_token')}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  }, [tag]);

  const handleSubmit = useCallback(async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileText = await readFileAsText(file);
      const chunks = chunkText(fileText, CHUNK_SIZE);
      const totalChunks = chunks.length;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        try {
          await uploadChunk(chunks[chunkIndex], chunkIndex, totalChunks);
          setUploadProgress(_prevProgress => ((chunkIndex + 1) / totalChunks) * 100);
        } catch (error) {
          console.error('Error uploading chunk:', error);
          setIsUploading(false);
          return;
        }
      }

      setUploadComplete(true);
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setIsUploading(false);
    }
  }, [file, uploadChunk]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadComplete(false);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Lead Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-x-4">
                <Label htmlFor="tag" className="text-sm font-medium">
                 TAG 
                <Input
                  id="tag"
									type="text"
									placeholder="Tag do seus leads"
									value={tag}
									onChange={(e) => setTag(e.target.value)}
                  />

                </Label>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                >
                  {file ? (
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-6 h-6 text-blue-500" />
                      <span className="font-medium text-gray-600">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <UploadIcon className="w-8 h-8 text-gray-400" />
                      <span className="font-medium text-gray-600">Click to select CSV file</span>
                    </div>
                  )}
                </label>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={!file || isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Submit'}
              </Button>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500">Uploading: {uploadProgress.toFixed(2)}%</p>
                </div>
              )}

              {uploadComplete && (
                <Alert>
                  <CheckCircleIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your CSV file has been successfully uploaded.</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
