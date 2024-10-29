import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import PropTypes from "prop-types";
import StudyPageUpdate from "./StudyPageUpdate.jsx";
import StudyPageDelete from "./StudyPageDelete.jsx";

const StudyPageInfo = () => {
  const {studyId} = useParams(); // URL 파라미터에서 studyId를 가져옴

  const userId = 1; // 임의의 userId
  const teamId = 100;

  const [expanded, setExpanded] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [study, setStudy] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  const fetchFiles = async () => {
    try {
      const response = await axios.get(`/api/files/BOOK_PAGE/${studyId}`);
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };
  const fetchStudyPage= async () => {
    try {
      const response = await axios.get(`/api/${teamId}/study-pages/${studyId}`);
      setStudy(response.data);
    } catch (error) {
      console.error('Failed to fetch page:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchStudyPage();
  }, [studyId]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('targetId', studyId);
    formData.append('targetType', 'BOOK_PAGE');

    try {
      const response = await axios.post(`/api/files/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedFiles((prevFiles) => [...prevFiles, response.data]);

      fetchFiles()
      setSelectedFile(null); // 업로드 후 선택된 파일 상태 초기화
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleFileDelete = async (storedFileName) => {
    try {
      await axios.delete(`/api/files/${storedFileName}`);
      setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file.storedFileName !== storedFileName)
      );
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleFileDownload = async (storedFileName, originalFileName) => {
    try {
      const response = await axios.get(`/api/files/${storedFileName}`, {
        responseType: 'blob', // Blob 형식으로 데이터 받기
      });

      const blob = new Blob([response.data],
          {type: response.headers['content-type']});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = originalFileName || storedFileName; // 다운로드할 파일 이름 지정
      document.body.appendChild(link);
      link.click();

      // 다운로드가 완료된 후, URL과 링크를 정리
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
      <div
          className="p-4 bg-gray-900 text-white min-h-screen flex justify-center">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{study.title}</h2>
            <p className="text-base text-gray-200 mb-6 leading-relaxed">{study.description}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-gray-700 to-gray-600">
            <h3 className="text-xl font-semibold mb-4">저장</h3>
            <ul className="space-y-2 mb-4">
              {uploadedFiles.map((file) => (
                  <li
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-md shadow-sm"
                  >
                    <div>
                      <span
                          className="text-sm font-semibold">{file.originalFileName}</span>
                      <span
                          className="text-xs text-gray-400 ml-2">({file.userNickname})</span>
                      <p className="text-xs text-gray-500">업로드
                        날짜: {file.createdAt}</p>
                      <p className="text-xs text-gray-500">파일
                        크기: {(file.fileSize / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="space-x-2">
                      <button
                          onClick={() => handleFileDownload(file.storedFileName,
                              file.originalFileName)}
                          className="text-blue-400 hover:underline text-sm"
                      >
                        다운로드
                      </button>
                      <button
                          onClick={() => handleFileDelete(file.storedFileName)}
                          className="text-red-400 hover:underline text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
            <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="block w-full text-sm text-gray-400 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer focus:outline-none mb-4 p-2"
            />
            <button
                onClick={handleFileUpload}
                disabled={isUploading} // 업로드 중이면 버튼 비활성화
                className={`w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-lg ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isUploading ? '업로드 중...' : '등록'}
            </button>
          </div>
          <div>
            <button
                onClick={toggleExpand}
                className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            >
              +
            </button>
            <div
                className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
                    expanded ? 'mt-4 opacity-100' : 'mt-0 opacity-0 pointer-events-none'
                }`}
            >
              <StudyPageUpdate studyId={studyId} teamId={teamId} />
              <StudyPageDelete studyId={studyId} teamId={teamId} studyname={study.title}/>
            </div>
          </div>
        </div>
      </div>
  );
};

StudyPageInfo.propTypes = { // 노란줄 안 뜨게 하려고 배열 내부 객체에 대한 명시
  uploadedFiles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        storedFileName: PropTypes.string.isRequired,
        originalFileName: PropTypes.string.isRequired,
        userNickname: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        fileSize: PropTypes.number.isRequired,
      })
  ).isRequired,
};
export default StudyPageInfo;
