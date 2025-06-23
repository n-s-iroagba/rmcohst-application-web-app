import { Eye, Download } from "lucide-react";
import { useState } from "react";

const FileViewer: React.FC<{ files: string[], types: string[] }> = ({ files, types }) => {
  const [selectedFile, setSelectedFile] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{types[index]} Certificate</span>
              <button
                onClick={() => setSelectedFile(selectedFile === index ? null : index)}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                {selectedFile === index ? 'Hide' : 'View'}
              </button>
            </div>
            {selectedFile === index && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                Certificate preview would appear here
                <button className="ml-2 text-blue-600 hover:text-blue-800">
                  <Download className="w-4 h-4 inline" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};