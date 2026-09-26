import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, Check, Ruler, Copy, ArrowUp, ArrowDown, Building2, HelpCircle, Info } from 'lucide-react';
import { DimensionUnit, RoomData, AreaDisplayUnit, RoomSpaceType, inferRoomSpaceType } from '../types';
import { DimensionParser } from '../utils/dimensionParser';
import { ROOM_CATEGORIES, CUSTOM_ROOM_OPTION } from '../data/roomCategories';

interface RoomCardProps {
  room: RoomData;
  index: number;
  displayUnit: AreaDisplayUnit;
  onUpdate: (updated: RoomData) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  totalAggregateCarpetSqFt?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  displayUnit,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  totalAggregateCarpetSqFt = 0,
}) => {
  const [isCustomName, setIsCustomName] = useState(() => {
    const allPredefined = Object.values(ROOM_CATEGORIES).flat();
    return !allPredefined.includes(room.name);
  });

  // Calculate formatted values from meters
  const getFeetInches = (meters: number) => {
    if (!meters || meters <= 0) return { feet: '', inches: '' };
    const totalInches = Math.round(DimensionParser.metersToInches(meters));
    return {
      feet: String(Math.floor(totalInches / 12)),
      inches: String(totalInches % 12),
    };
  };

  const getMeterCm = (meters: number) => {
    if (!meters || meters <= 0) return { m: '', cm: '' };
    const totalCm = Math.round(meters * 100);
    return {
      m: String(Math.floor(totalCm / 100)),
      cm: String(totalCm % 100),
    };
  };

  const getDecFeet = (meters: number) => {
    if (!meters || meters <= 0) return '';
    return (DimensionParser.metersToFeet(meters)).toFixed(2);
  };

  // Local state for inputs
  const initLenFI = getFeetInches(room.lengthMeters);
  const initWidFI = getFeetInches(room.widthMeters);
  const initLenMC = getMeterCm(room.lengthMeters);
  const initWidMC = getMeterCm(room.widthMeters);

  const [feetLen, setFeetLen] = useState<string | number>(initLenFI.feet);
  const [inchesLen, setInchesLen] = useState<string | number>(initLenFI.inches);
  const [feetWid, setFeetWid] = useState<string | number>(initWidFI.feet);
  const [inchesWid, setInchesWid] = useState<string | number>(initWidFI.inches);

  const [meterLen, setMeterLen] = useState<string | number>(initLenMC.m);
  const [cmLen, setCmLen] = useState<string | number>(initLenMC.cm);
  const [meterWid, setMeterWid] = useState<string | number>(initWidMC.m);
  const [cmWid, setCmWid] = useState<string | number>(initWidMC.cm);

  const [decFeetLen, setDecFeetLen] = useState<string>(getDecFeet(room.lengthMeters));
  const [decFeetWid, setDecFeetWid] = useState<string>(getDecFeet(room.widthMeters));

  // Sync inputs whenever room.lengthMeters or room.widthMeters changes from parent or presets
  useEffect(() => {
    const lenFI = getFeetInches(room.lengthMeters);
    const widFI = getFeetInches(room.widthMeters);
    const lenMC = getMeterCm(room.lengthMeters);
    const widMC = getMeterCm(room.widthMeters);

    setFeetLen(lenFI.feet);
    setInchesLen(lenFI.inches);
    setFeetWid(widFI.feet);
    setInchesWid(widFI.inches);

    setMeterLen(lenMC.m);
    setCmLen(lenMC.cm);
    setMeterWid(widMC.m);
    setCmWid(widMC.cm);

    setDecFeetLen(getDecFeet(room.lengthMeters));
    setDecFeetWid(getDecFeet(room.widthMeters));
  }, [room.lengthMeters, room.widthMeters]);

  // Synchronize room input unit mode with global displayUnit when displayUnit changes
  useEffect(() => {
    if (displayUnit === 'metric' && room.unit !== 'meterCm') {
      onUpdate({ ...room, unit: 'meterCm' });
    } else if (displayUnit === 'imperial' && room.unit === 'meterCm') {
      onUpdate({ ...room, unit: 'feetInches' });
    }
  }, [displayUnit]);

  // Handle unit tab toggle on card
  const handleUnitChange = (newUnit: DimensionUnit) => {
    onUpdate({
      ...room,
      unit: newUnit,
    });
  };

  // Direct dimension update handlers
  const handleLengthFeetInchesChange = (f: string, i: string) => {
    setFeetLen(f);
    setInchesLen(i);
    const fl = parseFloat(f) || 0;
    const il = parseFloat(i) || 0;
    const newLenMeters = DimensionParser.feetInchesToMeters(fl, il);
    onUpdate({
      ...room,
      lengthMeters: newLenMeters,
      isUserVerified: true,
    });
  };

  const handleWidthFeetInchesChange = (f: string, i: string) => {
    setFeetWid(f);
    setInchesWid(i);
    const fw = parseFloat(f) || 0;
    const iw = parseFloat(i) || 0;
    const newWidMeters = DimensionParser.feetInchesToMeters(fw, iw);
    onUpdate({
      ...room,
      widthMeters: newWidMeters,
      isUserVerified: true,
    });
  };

  const handleLengthMeterCmChange = (m: string, c: string) => {
    setMeterLen(m);
    setCmLen(c);
    const ml = parseFloat(m) || 0;
    const cl = parseFloat(c) || 0;
    const newLenMeters = DimensionParser.meterCmToMeters(ml, cl);
    onUpdate({
      ...room,
      lengthMeters: newLenMeters,
      isUserVerified: true,
    });
  };

  const handleWidthMeterCmChange = (m: string, c: string) => {
    setMeterWid(m);
    setCmWid(c);
    const mw = parseFloat(m) || 0;
    const cw = parseFloat(c) || 0;
    const newWidMeters = DimensionParser.meterCmToMeters(mw, cw);
    onUpdate({
      ...room,
      widthMeters: newWidMeters,
      isUserVerified: true,
    });
  };

  const handleLengthDecFeetChange = (val: string) => {
    setDecFeetLen(val);
    const dfl = parseFloat(val) || 0;
    const newLenMeters = dfl * 0.3048;
    onUpdate({
      ...room,
      lengthMeters: newLenMeters,
      isUserVerified: true,
    });
  };

  const handleWidthDecFeetChange = (val: string) => {
    setDecFeetWid(val);
    const dfw = parseFloat(val) || 0;
    const newWidMeters = dfw * 0.3048;
    onUpdate({
      ...room,
      widthMeters: newWidMeters,
      isUserVerified: true,
    });
  };

  const roomSqFt = DimensionParser.squareMetersToSquareFeet(room.lengthMeters * room.widthMeters);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all duration-200">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-black text-[12px] shrink-0">
            {index + 1}
          </span>

          {isCustomName ? (
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <input
                type="text"
                value={room.name}
                onChange={e => onUpdate({ ...room, name: e.target.value })}
                placeholder="Room Name"
                className="w-full font-black text-[#172033] text-lg px-2.5 py-1 rounded-lg border-transparent focus:border-[#CBD5E1] focus:ring-0 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setIsCustomName(false)}
                className="text-[10px] uppercase tracking-wider text-blue-600 hover:text-blue-800 shrink-0 font-black"
              >
                Presets
              </button>
            </div>
          ) : (
            <div className="relative flex-1 max-w-xs">
              <select
                value={room.name}
                onChange={e => {
                  if (e.target.value === CUSTOM_ROOM_OPTION) {
                    setIsCustomName(true);
                  } else {
                    const newName = e.target.value;
                    onUpdate({ ...room, name: newName, spaceType: inferRoomSpaceType(newName) });
                  }
                }}
                className="w-full appearance-none font-black text-[#172033] text-lg bg-transparent px-2.5 py-1 pr-8 rounded-lg border-transparent focus:border-[#CBD5E1] focus:ring-0 focus:outline-none cursor-pointer"
              >
                {Object.entries(ROOM_CATEGORIES).map(([cat, rooms]) => (
                  <optgroup key={cat} label={cat}>
                    {rooms.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value={CUSTOM_ROOM_OPTION}>+ Custom Name</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showTechnicalDetails ? 'text-blue-600 bg-blue-50' : 'text-[#94A3B8] hover:bg-[#F1F5F9]'}`}
            title="Technical Details"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete room"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RERA Space Classification (Simplified & Optional) */}
      {showTechnicalDetails && (
        <div className="mt-3">
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
                      <div className="flex items-center gap-1.5 font-bold text-blue-900">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Utility Space Classification</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-blue-200">
                        <button
                          type="button"
                          onClick={() => onUpdate({ ...room, spaceType: 'utility_inside' })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            effectiveSpaceType === 'utility_inside' ? 'bg-blue-600 text-white' : 'text-slate-500'
                          }`}
                        >
                          Inside
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdate({ ...room, spaceType: 'utility_outside' })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            effectiveSpaceType === 'utility_outside' ? 'bg-amber-600 text-white' : 'text-slate-500'
                          }`}
                        >
                          Outside
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-blue-700 leading-relaxed">
                      {effectiveSpaceType === 'utility_inside' 
                        ? 'Counted in RERA Carpet Area as it is within the external wall perimeter.' 
                        : 'Excluded from Carpet Area as it is outside the external wall perimeter (Dry Balcony).'}
                    </p>
                  </div>
                </div>
              );
            }

            if (isBalcony) {
              return (
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs flex items-center justify-between">
                  <p className="text-amber-800 font-medium leading-relaxed max-w-[80%]">
                    <strong>Balcony:</strong> Excluded from RERA Carpet Area; counted in Built-up Area only.
                  </p>
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-100 text-amber-900 rounded border border-amber-200">BUILT-UP</span>
                </div>
              );
            }

            return (
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs flex items-center justify-between">
                <p className="text-emerald-800 font-medium leading-relaxed max-w-[80%]">
                  <strong>Interior Room:</strong> Net usable floor area counted in RERA Carpet Area.
                </p>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-100 text-emerald-900 rounded border border-emerald-200">CARPET</span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Input Dimensions Grid */}
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div>
          <label className="block text-[11px] font-black text-[#64748B] mb-2 uppercase tracking-widest">
            Length
          </label>
          {room.unit === 'feetInches' && (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={feetLen}
                onChange={e => handleLengthFeetInchesChange(e.target.value, String(inchesLen))}
                className="w-12 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">ft</span>
              <input
                type="number"
                value={inchesLen}
                onChange={e => handleLengthFeetInchesChange(String(feetLen), e.target.value)}
                className="w-10 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">in</span>
            </div>
          )}
          {room.unit === 'meterCm' && (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={meterLen}
                onChange={e => handleLengthMeterCmChange(e.target.value, String(cmLen))}
                className="w-12 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">m</span>
              <input
                type="number"
                value={cmLen}
                onChange={e => handleLengthMeterCmChange(String(meterLen), e.target.value)}
                className="w-10 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">cm</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-black text-[#64748B] mb-2 uppercase tracking-widest">
            Width
          </label>
          {room.unit === 'feetInches' && (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={feetWid}
                onChange={e => handleWidthFeetInchesChange(e.target.value, String(inchesWid))}
                className="w-12 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">ft</span>
              <input
                type="number"
                value={inchesWid}
                onChange={e => handleWidthFeetInchesChange(String(feetWid), e.target.value)}
                className="w-10 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">in</span>
            </div>
          )}
          {room.unit === 'meterCm' && (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={meterWid}
                onChange={e => handleWidthMeterCmChange(e.target.value, String(cmWid))}
                className="w-12 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">m</span>
              <input
                type="number"
                value={cmWid}
                onChange={e => handleWidthMeterCmChange(String(meterWid), e.target.value)}
                className="w-10 text-center font-black text-[#172033] bg-slate-50 border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none py-1"
              />
              <span className="text-xs font-bold text-slate-400">cm</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#F8FAFC] flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-0.5">Room Area</span>
          <span className="text-xl font-black text-[#172033]">
            {DimensionParser.formatArea(roomSqFt, displayUnit)}
          </span>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => handleUnitChange(room.unit === 'feetInches' ? 'meterCm' : 'feetInches')}
            className="text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-tight"
          >
            Switch to {room.unit === 'feetInches' ? 'Meters' : 'Feet'}
          </button>
        </div>
      </div>
    </div>
  );
};
