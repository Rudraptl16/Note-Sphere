'use client';

import { useState, useEffect, useMemo } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('app-notes');
    if (stored) {
      setNotes(JSON.parse(stored));
    } else {
      setNotes([
        {
          id: 1,
          title: 'Getting Started ✨',
          content: 'Organize your logic securely.',
          color: '#818cf8',
          tag: 'Personal',
          pinned: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    const storedTheme = localStorage.getItem('app-theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('app-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isMounted]);

  useEffect(() => {
    const handleOutside = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  const saveNotes = (updated) => {
    setNotes(updated);
    localStorage.setItem('app-notes', JSON.stringify(updated));
  };

  const handleAddNote = () => {
    const colors = ['#818cf8', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNote = {
      id: Date.now(),
      title: '',
      content: '',
      color: randomColor,
      tag: 'Personal',
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    saveNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (id, field, value) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, [field]: value } : n));
    saveNotes(updated);
  };

  const handleRemoveNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const handleTogglePin = (id) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    saveNotes(updated);
  };

  const exportToTXT = (note) => {
    const element = document.createElement('a');
    const file = new Blob([`Title: ${note.title}\n\n${note.content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title || 'Note'}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const tags = ['All', 'Personal', 'Work', 'Ideas', 'Shopping'];

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (selectedTag !== 'All') {
      result = result.filter((n) => n.tag === selectedTag);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(query)) ||
          (n.content && n.content.toLowerCase().includes(query))
      );
    }

    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [notes, searchQuery, selectedTag]);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen w-full transition-all duration-500 font-poppins relative ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Blur Overlay when Modal is open */}
      {viewingNote && (
        <div 
          className="fixed inset-0 z-40 backdrop-blur-md bg-black/40 transition-all duration-500"
          onClick={() => setViewingNote(null)}
        />
      )}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <main className={`max-w-6xl mx-auto px-6 py-16 flex flex-col items-center transition-all duration-500 ${viewingNote ? 'blur-sm scale-[0.98]' : ''}`}>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mb-16 note-animate">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bricolage flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-10 h-10 text-indigo-400">
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V352c0-17.7 14.3-32 32-32h128V96c0-35.3-28.7-64-64-64H64zM448 352H320v128L448 352z"/>
              </svg>
              <span>Note Sphere</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-2 tracking-wide">Seamless conceptual processing.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3.5 rounded-full border transition-all cursor-pointer shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 21v-2.25m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleAddNote}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-full shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Create</span>
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-6 items-center mb-12 bg-slate-900/10 border border-slate-800/30 p-6 rounded-3xl note-animate">
          <div className="relative w-full md:flex-grow flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter thoughts..."
              className={`w-full pl-12 pr-5 py-3.5 rounded-2xl outline-none border text-sm ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
            />
            <div className="absolute left-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-2xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${selectedTag === tag ? 'bg-indigo-600 text-white border-indigo-500' : isDarkMode ? 'bg-slate-900/20 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="py-20 text-slate-600 font-bold text-sm">No entries found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full font-poppins">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setViewingNote(note)}
                className={`note-animate group flex flex-col justify-between p-6 rounded-3xl border transition-all duration-300 relative hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800/60 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                style={{ borderLeftColor: note.color, borderLeftWidth: '6px' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <input
                      type="text"
                      value={note.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateNote(note.id, 'title', e.target.value)}
                      placeholder="Untitled"
                      className={`font-bold text-base bg-transparent outline-none flex-grow ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                    />
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`cursor-pointer transition-all ${note.pinned ? 'text-indigo-400 opacity-100' : 'text-slate-500 opacity-30 group-hover:opacity-70'}`}
                      title={note.pinned ? 'Unpin Note' : 'Pin Note'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={note.pinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                      </svg>
                    </button>
                  </div>

                  <textarea
                    value={note.content}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleUpdateNote(note.id, 'content', e.target.value)}
                    placeholder="Description..."
                    className={`w-full min-h-[120px] bg-transparent outline-none resize-none text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                  />
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/20">

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === note.id ? null : note.id);
                      }}
                      className={`text-2xs font-bold uppercase px-3 py-1.5 rounded-xl border cursor-pointer transition-all flex items-center gap-1 ${isDarkMode ? 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                    >
                      <span>{note.tag || 'Personal'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5 text-slate-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {activeDropdownId === note.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute bottom-full left-0 mb-2 w-32 rounded-xl shadow-xl border p-1.5 z-10 backdrop-blur-xl ${isDarkMode ? 'bg-slate-950/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}
                      >
                        {tags.filter(t => t !== 'All').map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              handleUpdateNote(note.id, 'tag', t);
                              setActiveDropdownId(null);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider cursor-pointer transition-all ${note.tag === t ? 'bg-indigo-600 text-white' : isDarkMode ? 'hover:bg-slate-800/50 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-950'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => exportToTXT(note)}
                      className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-all"
                      title="Export as TXT"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleRemoveNote(note.id)}
                      className="text-slate-500 hover:text-red-400 opacity-50 hover:opacity-100 cursor-pointer transition-all"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 p-1.5 rounded-full border border-slate-800 shadow-md">
                  {['#818cf8', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleUpdateNote(note.id, 'color', c)}
                      className="w-3.5 h-3.5 rounded-full border border-slate-950 cursor-pointer hover:scale-125 transition-all"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in duration-300">
          <div 
            className={`w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
            style={{ borderTop: `8px solid ${viewingNote.color}` }}
          >
            <div className="flex items-center justify-between p-8 pb-4">
              <input
                type="text"
                value={viewingNote.title}
                onChange={(e) => {
                  handleUpdateNote(viewingNote.id, 'title', e.target.value);
                  setViewingNote({ ...viewingNote, title: e.target.value });
                }}
                placeholder="Untitled"
                className={`text-3xl font-black bg-transparent outline-none w-full ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
              />
              <button 
                onClick={() => setViewingNote(null)}
                className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 pt-2">
              <textarea
                value={viewingNote.content}
                onChange={(e) => {
                  handleUpdateNote(viewingNote.id, 'content', e.target.value);
                  setViewingNote({ ...viewingNote, content: e.target.value });
                }}
                placeholder="Start writing..."
                className={`w-full min-h-[300px] bg-transparent outline-none resize-none text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
              />
            </div>

            <div className={`p-6 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                  {viewingNote.tag}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Created {new Date(viewingNote.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                 <button
                  onClick={() => exportToTXT(viewingNote)}
                  className={`p-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-indigo-400' : 'hover:bg-white text-slate-500 hover:text-indigo-600 shadow-sm'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    handleRemoveNote(viewingNote.id);
                    setViewingNote(null);
                  }}
                  className={`p-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400' : 'hover:bg-white text-slate-500 hover:text-red-600 shadow-sm'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
