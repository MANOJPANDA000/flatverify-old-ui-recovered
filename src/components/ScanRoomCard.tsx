import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Edit2, Trash2, Check, X, Building2, Info } from 'lucide-react';
import { AreaDisplayUnit, RoomData, inferRoomSpaceType } from '../types';
import { DimensionParser } from '../utils/dimensionParser';

interface ScanRoomCardProps {
  room: RoomData;
  displayUnit: AreaDisplayUnit;
  onUpdate: (updated: RoomData) => void;
  onRemove: () => void;
}

export const ScanRoomCard: React.FC<ScanRoomCardProps> = ({
  room,
  displayUnit,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [editName, setEditName] = useState(room.name);
  const [editLengthStr, setEditLengthStr] = useState(
    DimensionParser.formatFeetInches(room.lengthMeters)
  );
  const [editWidthStr, setEditWidthStr] = useState(
    DimensionParser.formatFeetInches(room.widthMeters)
  );

  const roomSqFt = DimensionParser.squareMetersToSquareFeet(room.lengthMeters * room.widthMeters);

  const handleSaveEdit = () => {
    const newLenMeters = DimensionParser.parseDimensionToMeters(editLengthStr);
    const newWidMeters = DimensionParser.parseDimensionToMeters(editWidthStr);
    const trimmedName = editName.trim() || room.name;

    onUpdate({
      ...room,
      name: trimmedName,
      spaceType: room.spaceType || inferRoomSpaceType(trimmedName),
      lengthMeters: newLenMeters > 0 ? newLenMeters : room.lengthMeters,
      widthMeters: newWidMeters > 0 ? newWidMeters : room.widthMeters,
      isUserVerified: true,
    });
    setIsEditing(false);
  };

  const toggleVerified = () => {
    onUpdate({
      ...room,
      isUserVerified: !room.isUserVerified,
    });
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-150 ${
        room.isUserVerified
          ? 'bg-white border-[#E2E8F0] shadow-xs'
          : 'bg-[#FFFDF7] border-[#FDE68A]'
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-[#64748B] mb-1.5 uppercase tracking-widest">
              Room Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm font-bold text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-[#64748B] mb-1.5 uppercase tracking-widest">
                Length
              </label>
              <input
                type="text"
                value={editLengthStr}
                onChange={e => setEditLengthStr(e.target.value)}
                placeholder="10' 0 in"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm font-bold text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#64748B] mb-1.5 uppercase tracking-widest">
                Width
              </label>
              <input
                type="text"
                value={editWidthStr}
                onChange={e => setEditWidthStr(e.target.value)}
                placeholder="10' 0 in"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm font-bold text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#172033]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-5 py-2 text-xs font-black bg-blue-600 text-white hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-4 min-w-0">
              <button
                type="button"
                onClick={toggleVerified}
                title={room.isUserVerified ? 'Click to uncheck' : 'Click to check measurement'}
                className="shrink-0 pt-1 cursor-pointer"
              >
                {room.isUserVerified ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-amber-300 bg-amber-50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                )}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-lg text-[#172033] truncate">
                    {room.name}
                  </h4>
                  {room.isUserVerified && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ Checked
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Length</span>
                    <span className="text-sm font-bold text-[#172033]">{DimensionParser.formatLength(room.lengthMeters, displayUnit)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Width</span>
                    <span className="text-sm font-bold text-[#172033]">{DimensionParser.formatLength(room.widthMeters, displayUnit)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Area</span>
                <span className="text-xl font-black text-[#2457D6]">
                  {DimensionParser.formatArea(roomSqFt, displayUnit)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className={`p-1.5 rounded-lg transition-colors ${showTechnicalDetails ? 'text-blue-600 bg-blue-50' : 'text-[#94A3B8] hover:bg-slate-50'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-[#64748B] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1.5 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {!room.isUserVerified && (
            <button 
              onClick={toggleVerified}
              className="mt-4 w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Check measurement
            </button>
          )}

          {/* Technical Details (Simplified & Optional) */}
          {showTechnicalDetails && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              {(() => {
                const effectiveSpaceType = room.spaceType || inferRoomSpaceType(room.name);
                const nameLower = room.name.toLowerCase();
                const isUtility =
                  nameLower.includes('utility') ||
                  nameLower.includes('dry balcony') ||
                  nameLower.includes('wash') ||
                  nameLower.includes('yard');
                const isBalcony =
                  !isUtility &&
                  (nameLower.includes('balcony') ||
                    nameLower.includes('balc') ||
                    nameLower.includes('verandah') ||
                    nameLower.includes('veranda') ||
                    nameLower.includes('sitout') ||
                    nameLower.includes('deck') ||
                    nameLower.includes('terrace'));

                if (isUtility) {
                  return (
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900">Utility Classification</span>
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-blue-200">
                            <button
                              type="button"
                              onClick={() => onUpdate({ ...room, spaceType: 'utility_inside' })}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                effectiveSpaceType === 'utility_inside' ? 'bg-blue-600 text-white' : 'text-slate-500'
                              }`}
                            >
                              Inside
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdate({ ...room, spaceType: 'utility_outside' })}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                effectiveSpaceType === 'utility_outside' ? 'bg-amber-600 text-white' : 'text-slate-500'
                              }`}
                            >
                              Outside
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-blue-700 leading-relaxed">
                          Determines if space is inside external walls (Carpet) or outside (Built-up).
                        </p>
                      </div>
                    </div>
                  );
                }

                if (isBalcony) {
                  return (
                    <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs flex items-center justify-between">
                      <p className="text-amber-800 font-medium">Balcony: Counted in Built-up Area only.</p>
                      <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-100 text-amber-900 rounded">BUILT-UP</span>
                    </div>
                  );
                }

                return (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs flex items-center justify-between">
                    <p className="text-emerald-800 font-medium">Interior Room: Counted in RERA Carpet Area.</p>
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-100 text-emerald-900 rounded">CARPET</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
